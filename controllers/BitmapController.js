"use strict";

/**
 * Bitmap class implementation
 */
class BitmapController {

  /**
   * Questions showing in the console
   * @returns {string[]}
   */
  get questions() {
    return [
      "Input the number of bitmaps to generate: ",
      "Input the bitmap width: ",
      "Input the bitmap length: "
    ];
  }

  /**
   * Main function, shows bitmaps and distances for each pixel
   *
   * @returns undefined
   */
  showResult() {
    process.stdin.setEncoding("utf8");

    const answers = [];

    console.log(this.questions[0]);

    process.stdin.on("data", (data) => {

      answers.push(Number(data.trim()));

      if (answers.length < this.questions.length) {
        console.log(this.questions[answers.length])
      } else {

        const bitmaps = this._getBitmaps(answers);
        bitmaps.forEach(bitmap => {
          const distances = this._getDistances(bitmap);
          const bitmapHeight = answers[2];

          this._showResult(bitmap, distances, bitmapHeight);
        });
        process.exit();
      }
    });

    process.on("exit", () => {
      console.log("end \n")
    })
  }

  /**
   * Get array of generated bitmaps
   *
   * @param {array} answers object containing input information
   * @returns {Array} generated bitmaps
   * @private
   */
  _getBitmaps(answers) {
    const [bitmapsAmount, width, height] = answers;

    const bitmaps = [];
    for (let i = 0; i < bitmapsAmount; i++) {
      bitmaps.push(this._getBitmap(width, height));
    }

    return bitmaps;
  }

  /**
   * Generates one bitmap with random pixels from 0 to 1
   * @param {number} width number of columns
   * @param {number} height number of rows
   * @returns {Array} generated bitmap
   * @private
   */
  _getBitmap(width, height) {
    const result = [];

    for (let w = 1; w <= width; w++) {
      for (let h = 1; h <= height; h++) {
        result.push({width: w, height: h, value: Math.round(Math.random())});
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
      if (bitmap[elem].value !== 0) {
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