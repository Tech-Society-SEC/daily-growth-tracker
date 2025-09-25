// src/game.jsx
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

function Game() {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    class Match3Scene extends Phaser.Scene {
      constructor() {
        super("match3");
        this.gridSize = 8;
        this.tileSize = 64;
        this.candyTypes = ["apple", "banana", "grape", "orange", "strawberry"];
        this.grid = [];
        this.selected = null;
      }

      preload() {
        // Load fruit icons (from /public/assets/)
        this.load.image("apple", "/assets/apple.png");
        this.load.image("banana", "/assets/banana.png");
        this.load.image("grape", "/assets/grape.png");
        this.load.image("orange", "/assets/orange.png");
        this.load.image("strawberry", "/assets/strawberry.png");

        // Load local sound
        this.load.audio("pop", "/assets/pop.mp3");
      }

      create() {
        this.score = 0;
        this.scoreText = this.add.text(20, 20, "Score: 0", {
          fontSize: "28px",
          fontFamily: "Arial Black",
          fill: "#fff",
          stroke: "#000",
          strokeThickness: 6,
        });

        this.createBoard();
      }

      createBoard() {
        for (let row = 0; row < this.gridSize; row++) {
          this.grid[row] = [];
          for (let col = 0; col < this.gridSize; col++) {
            this.addCandy(row, col);
          }
        }
      }

      addCandy(row, col) {
        let candyType = Phaser.Utils.Array.GetRandom(this.candyTypes);
        let candy = this.add
          .sprite(col * this.tileSize + 150, row * this.tileSize + 100, candyType)
          .setInteractive();
        candy.setData({ type: candyType, row, col });

        candy.on("pointerdown", () => this.selectCandy(candy));
        this.grid[row][col] = candy;
        return candy;
      }

      selectCandy(candy) {
        if (!this.selected) {
          this.selected = candy;
          candy.setScale(1.2); // highlight
        } else {
          if (this.areAdjacent(this.selected, candy)) {
            this.swapCandies(this.selected, candy);
            this.checkMatches().then((matched) => {
              if (!matched) {
                this.swapCandies(this.selected, candy); // swap back if no match
              }
            });
          }
          this.selected.setScale(1);
          this.selected = null;
        }
      }

      areAdjacent(c1, c2) {
        let rowDiff = Math.abs(c1.getData("row") - c2.getData("row"));
        let colDiff = Math.abs(c1.getData("col") - c2.getData("col"));
        return rowDiff + colDiff === 1;
      }

      swapCandies(c1, c2) {
        let r1 = c1.getData("row"),
          c1Col = c1.getData("col");
        let r2 = c2.getData("row"),
          c2Col = c2.getData("col");

        this.grid[r1][c1Col] = c2;
        this.grid[r2][c2Col] = c1;

        c1.setData({ row: r2, col: c2Col, type: c1.getData("type") });
        c2.setData({ row: r1, col: c1Col, type: c2.getData("type") });

        this.tweens.add({ targets: c1, x: c2.x, y: c2.y, duration: 200 });
        this.tweens.add({ targets: c2, x: c1.x, y: c1.y, duration: 200 });
      }

      async checkMatches() {
        let matched = [];

        // Check rows
        for (let row = 0; row < this.gridSize; row++) {
          for (let col = 0; col < this.gridSize - 2; col++) {
            let c1 = this.grid[row][col];
            let c2 = this.grid[row][col + 1];
            let c3 = this.grid[row][col + 2];
            if (
              c1 &&
              c2 &&
              c3 &&
              c1.getData("type") === c2.getData("type") &&
              c2.getData("type") === c3.getData("type")
            ) {
              matched.push(c1, c2, c3);
            }
          }
        }

        // Check cols
        for (let col = 0; col < this.gridSize; col++) {
          for (let row = 0; row < this.gridSize - 2; row++) {
            let c1 = this.grid[row][col];
            let c2 = this.grid[row + 1][col];
            let c3 = this.grid[row + 2][col];
            if (
              c1 &&
              c2 &&
              c3 &&
              c1.getData("type") === c2.getData("type") &&
              c2.getData("type") === c3.getData("type")
            ) {
              matched.push(c1, c2, c3);
            }
          }
        }

        if (matched.length > 0) {
          this.sound.play("pop");
          let uniqueCandies = [...new Set(matched)];
          uniqueCandies.forEach((candy) => {
            let row = candy.getData("row");
            let col = candy.getData("col");
            this.grid[row][col] = null;
            candy.destroy();
          });

          this.score += uniqueCandies.length * 10;
          this.scoreText.setText("Score: " + this.score);

          await this.time.delayedCall(250, () => this.dropCandies());
          return true;
        }
        return false;
      }

      dropCandies() {
        for (let col = 0; col < this.gridSize; col++) {
          for (let row = this.gridSize - 1; row >= 0; row--) {
            if (this.grid[row][col] === null) {
              for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                if (this.grid[aboveRow][col]) {
                  let candy = this.grid[aboveRow][col];
                  this.grid[row][col] = candy;
                  this.grid[aboveRow][col] = null;

                  candy.setData({ row, col, type: candy.getData("type") });
                  this.tweens.add({ targets: candy, y: row * this.tileSize + 100, duration: 200 });
                  break;
                }
              }
            }
          }
          for (let row = 0; row < this.gridSize; row++) {
            if (this.grid[row][col] === null) {
              let candy = this.addCandy(row, col);
              candy.y = -50;
              this.tweens.add({ targets: candy, y: row * this.tileSize + 100, duration: 200 });
            }
          }
        }
        this.time.delayedCall(300, () => this.checkMatches());
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [Match3Scene],
      parent: "candy-canvas",
      backgroundColor: "#1e293b",
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #f472b6, #60a5fa, #34d399)",
      }}
    >
      <div id="candy-canvas"></div>
    </div>
  );
}

export default Game;
