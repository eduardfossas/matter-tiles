import { Rectangle } from "./rectangle.js";

const BACK_COLOR = "#333";
const STICK_COLOR = "#faf0e6";

class App {
  constructor() {
    this.canvas = {
      el: document.querySelector("canvas"),
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.matter = {
      composites: Matter.Composites,
      composite: Matter.Composite,
      engine: Matter.Engine,
      render: Matter.Render,
      runner: Matter.Runner,
      mouseConstraint: Matter.MouseConstraint,
      mouse: Matter.Mouse,
      bounds: Matter.Bounds,
    };
    this.engine = this.matter.engine.create({ gravity: { scale: 0, y: 0 } });
    this.world = this.engine.world;
    this.render = this.matter.render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: this.canvas.width,
        height: this.canvas.height,
        showStats: false,
        showPerformance: false,
        wireframes: false,
        background: BACK_COLOR,
      },
    });

    this.stick = {
      width: 10,
      height: 100,
      margin: 50,
    };
    this.addResize();
    this.addBlock();
    this.renderWorld();
    this.createMouseEvent();

    this.runner = this.matter.runner.create();
    this.matter.runner.run(this.runner, this.engine);
  }

  addBlock() {
    if (this.canvas.width < this.canvas.height) {
      this.block = this.matter.composites.stack(
        this.canvas.width / 10 - 10,
        this.canvas.width / 10 - 10,
        7,
        10,
        this.canvas.width / 10 + 5,
        0,
        (x, y) => {
          return new Rectangle(x, y, this.stick.width, this.stick.height - 22, {
            render: { fillStyle: STICK_COLOR },
          }).rect;
        }
      );
    } else {
      this.block = this.matter.composites.stack(
        this.canvas.width / 2 - 700,
        this.canvas.height / 2 - 300,
        25,
        5,
        this.stick.margin,
        0,
        (x, y) => {
          return new Rectangle(x, y, this.stick.width, this.stick.height, {
            render: { fillStyle: STICK_COLOR },
          }).rect;
        }
      );
    }

    this.matter.composite.add(this.world, [
      this.block, // walls
      new Rectangle(this.canvas.width / 2, 0, this.canvas.width, 10, {
        isStatic: true,
        render: { opacity: 0 },
      }).rect,
      new Rectangle(
        this.canvas.width / 2,
        this.canvas.height,
        this.canvas.width,
        10,
        {
          isStatic: true,
          render: { opacity: 0 },
        }
      ).rect,
      new Rectangle(0, this.canvas.height / 2, 10, this.canvas.height, {
        isStatic: true,
        render: { opacity: 0 },
      }).rect,
      new Rectangle(
        this.canvas.width,
        this.canvas.height / 2,
        10,
        this.canvas.height,
        {
          isStatic: true,
          render: { opacity: 0 },
        }
      ).rect,
    ]);
  }

  addRectangles() {
    this.context.fillStyle = STICK_COLOR;

    for (let u = 0; u < 25; u++) {
      const margin = this.stick.width + this.stick.margin * u;
      for (let v = 0; v < 5; v++) {
        const marginY = 100 * v;
        this.context.fillRect(
          this.canvas.el.width / 2 - 600 + margin,
          this.canvas.el.height / 2 - 300 + marginY,
          10,
          100
        );
      }
    }
  }

  createMouseEvent() {
    this.mouse = this.matter.mouse.create(this.render.canvas);
    this.mouseConstraint = this.matter.mouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    this.matter.composite.add(this.world, this.mouseConstraint);
  }

  setSize() {
    this.render.bounds.max.x = window.innerWidth;
    this.render.bounds.max.y = window.innerHeight;
    this.render.options.width = window.innerWidth;
    this.render.options.height = window.innerHeight;
    this.render.canvas.width = window.innerWidth;
    this.render.canvas.height = window.innerHeight;
  }

  addResize() {
    this.setSize();
    window.addEventListener("resize", () => this.setSize());
  }

  renderWorld() {
    this.matter.render.run(this.render);
  }
}

new App();
