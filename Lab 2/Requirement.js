/*IMPORTANT NOTES
1- you are using JS Name Casing (CamelCasing)
2- make this code as clean as possible 
3- apply all the concepts you learned during this lab (Naming, comments,  functions)
*/

class Point {
  constructor(coordX, coordY) {
    this.coordX = coordX;
    this.coordY = coordY;
  }
}

class Rectangle {
  constructor(startingPoint, width, height) {
    if (this.isValidParameters(startingPoint, width, height)) {
      this.startingPoint = startingPoint;
      this.width = width;
      this.height = height;
    }
  }

  // ***************
  // METHODS
  // ***************

  isValidParameters = (startingPoint, width, height) => {
    if (!startingPoint) {
      console.log("Invalid Starting Point");
      return false;
    }

    if (!height || height <= 0) {
      console.log("Invalid Height");
      return false;
    }

    if (!width || width <= 0) {
      console.log("Invalid Width");
      return false;
    }

    return true;
  };

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * this.width + 2 * this.height;
  }

  updateHeight(height) {
    if (height && height > 0) {
      if (this.width === this.height) {
        this.width = height;
      }
      this.height = height;
      return true;
    } else {
      return false;
    }
  }

  updateParameters({ startingPoint, width, height }) {
    if (this.isValidParameters(startingPoint, width, height)) {
      this.startingPoint = startingPoint;
      this.width = width;
      this.height = height;
    }
  }

  getHeight() {
    return this.height;
  }

  // Function that prints the endpoints
  printEndPoints() {
    const topRight = this.startingPoint.coordX + this.width;
    const bottomLeft = this.startingPoint.coordY + this.height;

    console.log("End Point X-Axis (Top Right): " + topRight);
    console.log("End Point Y-Axis (Bottom Left): " + bottomLeft);
  }

  getWidth() {
    return this.width;
  }
}

function constructSquare(startingPoint, squareSideLength) {
  if (!squareSideLength || squareSideLength <= 0) {
    console.log("Invalid square side length");
    return null;
  }
  const square = new Rectangle(
    startingPoint,
    squareSideLength,
    squareSideLength
  );

  const squareArea = square.area();
  const squarePerimeter = square.perimeter();

  console.log("Square Area: ", squareArea);
  console.log("Square Perimeter: ", squarePerimeter);

  return square;
}

const startingPoint = new Point(2, 3);
const rectangle = new Rectangle(startingPoint, 5, 4);
const square = constructSquare(startingPoint, 4);

console.log(square.perimeter());

rectangle.updateHeight(3);
