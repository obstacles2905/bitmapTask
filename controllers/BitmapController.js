"use strict";
const readline = require("readline");

/**
 * Bitmap class implementation
 */
class BitmapController {

  /**
   * Main function, asks questions, shows bitmaps and distances for each pixel
   *
   * @returns undefined
   */
  async showResult() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (str) => new Promise(resolve => rl.question(str, resolve));
    const steps = {
      start: async() => {
        console.log("Welcome to the bitmap distance app")
      },
      getAmount: async() => {
        const amount = async() => {
          const answer = await question("Input the number of bitmaps: ");

          if (!Number(answer)) {
            console.error("Incorrect amount. The value must be a number");
            return await amount();
          }

          return answer;
        };

        return await amount();
      },
      getWidth: async() => {
        const width = async() => {
          const answer = await question("Input the bitmap width: ");

          if (!Number(answer)) {
            console.error("Incorrect width. The value must be a number");
            return await width();
          }

          return answer;
        };

        return await width();
      },
      getHeight: async() => {
        const height = async() => {
          const answer = await question("Input the bitmap height: ");

          if (!Number(answer)) {
            console.error("Incorrect height. The value must be a number");
            return await height();
          }

          return answer;
        };

        return await height();
      },
      getGenerationWay: async() => {
        const generationWay = async() => {
          const answer = Number(await question(`Do you want the data to be generated randomly
          or by input? (0 - input, 1 - random): `));

          if (!this._isValidData(answer)) {
            console.error("Incorrect answer. The value must be either 0 or 1");
            return await generationWay();
          }

          return answer;
        };

        return await generationWay();
      }
    };

    steps.start();
    let amount = await steps.getAmount();
    let width = await steps.getWidth();
    let height = await steps.getHeight();
    const generationWay = Number(await steps.getGenerationWay(amount, width, height));

    generationWay === 0
      ? this._getInputBitmaps(amount, width, height)
      : this._getGeneratedBitmaps(amount, width, height);

  }

  /**
   * Transform and show input bitmap data
   *
   * @param {string} amount of bitmaps to generate
   * @param {string} width number of columns
   * @param {string} height number of rows
   * @private
   */
  _getInputBitmaps(amount, width, height) {
    const arraySize = width*height;

    console.log(`Input ${width*height} numbers from 0 to 1`);
    const inputData = [];

    process.stdin.on("data", (data) => {
      if (this._isValidData(data)) {
        inputData.push(Number(data));

        if (inputData.length < arraySize) {
          console.log("Input another number");
        } else {

          const bitmaps = this._getBitmaps(amount, width, height, false, inputData);
          bitmaps.forEach(bitmap => {
            const distances = this._getDistances(bitmap);
            this._showResult(bitmap, distances, height);
          });
        }
      } else {
        console.error("Incorrect data, the value must be either 0 or 1")
      }
    });
  }

  /**
   * Checks if data is valid
   *
   * @param {number} element to check
   * @returns {boolean} true if the element is 0 or 1
   * @private
   */
  _isValidData(element) {
    return Number(element) === 0 || Number(element) === 1;
  }

  /**
   * Generates bitmaps and shows result to console
   *
   * @param {number} amount of bitmaps to generate
   * @param {number} width number of columns
   * @param {number} height number of rows
   * @private
   */
  _getGeneratedBitmaps(amount, width, height) {
    const bitmaps = this._getBitmaps(amount, width, height, true);
    bitmaps.forEach(bitmap => {
      const distances = this._getDistances(bitmap);

      this._showResult(bitmap, distances, height);
    });
  }

  /**
   * Get array of generated bitmaps
   *
   * @param {string} amount of bitmaps to be generated
   * @param {string} width of bitmap
   * @param {string} height of bitmap
   * @param {boolean} isGenerated means data should be randomly generated
   * @param {number} value pixel value
   * @returns {Array} generated bitmaps
   * @private
   */
  _getBitmaps(amount, width, height, isGenerated, value) {
    const bitmaps = [];
    for (let i = 0; i < amount; i++) {
      bitmaps.push(this._getBitmap(width, height, isGenerated, value));
    }

    return bitmaps;
  }

  /**
   * Generates one bitmap with random pixels from 0 to 1
   * @param {number} width number of columns
   * @param {number} height number of rows
   * @param {boolean} isGenerated means data should be randomly generated
   * @param {number} value pixel value
   * @returns {Array} generated bitmap
   * @private
   */
  _getBitmap(width, height, isGenerated, value) {
    const result = [];

    let i = 0;
    for (let w = 1; w <= width; w++) {
      for (let h = 1; h <= height; h++) {
        if (isGenerated) {
          result.push({width: w, height: h, value: Math.round(Math.random())});
        } else {
          result.push({width: w, height: h, value: value[i]});
          i++;
        }
      }

    }

    const whitePixelExists = result.find(bit => bit.value === 1);
    if (!whitePixelExists) {
      result[0].value = 1;
    }
    return result;
  }

  /**
   * Generates closest distance for each 0 pixel to the each 1 pixel;
   * @param {Array<Object>} bitmap daata
   * @returns {Array} distances array
   * @private
   */
  _getDistances(bitmap) {
    const distances = [];

    for (let elem in bitmap) {
      if (bitmap[elem].value === 1) {
        distances.push(0);
        continue;
      }

      const searchedElements = bitmap.filter(e => e.value === 1);

      const minDistance = searchedElements
        .map(e =>
          Math.abs(bitmap[elem].width - e.width) +
          Math.abs(bitmap[elem].height - e.height))
        .sort()
        .shift();

      distances.push(minDistance);
    }
    return distances;
  }

  /**
   * Outputs bitmap and its distance arrays to the console
   * @param {Array<Object>} bitmap data
   * @param {Array} distances data
   * @param {number} height number of columns
   * @private
   */
  _showResult(bitmap, distances, height) {
    console.log("Bitmap data: ");

    for (let bit = 0; bit < bitmap.length; bit++) {
      if (bit % height === 0) {
        process.stdout.write(bitmap[bit].value.toString() + "\n");
      } else {
        process.stdout.write(bitmap[bit].value.toString() + " ")
      }
    }

    console.log("\n");
    console.log("Bitmap distances: ");
    for (let elem = 0; elem < distances.length; elem++) {
      if (elem % height === 0) {
        process.stdout.write(distances[elem].toString() + "\n");
      } else {
        process.stdout.write(distances[elem].toString() + " ")
      }
    }
    console.log("\n");
  }
}

module.exports = BitmapController;