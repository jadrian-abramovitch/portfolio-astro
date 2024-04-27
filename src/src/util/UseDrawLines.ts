function UseDrawLines() {
  function getStartingHeight(index: number) {
    const cards = document.querySelectorAll("#left-box .link-card");
    const cardBounds: Array<DOMRect> = [];
    cards.forEach((card) => cardBounds.push(card.getBoundingClientRect()));
    const leftBoxBounds = document
      .getElementById("left-box")
      ?.getBoundingClientRect();
    const centerBoxBounds = document
      .getElementById("center-box")
      ?.getBoundingClientRect();
    if (!leftBoxBounds || !centerBoxBounds) {
      return 0;
    }
    if (cards.length === 0) {
      return centerBoxBounds.height / 2;
    }
    return (
      leftBoxBounds.y -
      centerBoxBounds.y +
      leftBoxBounds.height -
      (leftBoxBounds.bottom - cardBounds[index].bottom) -
      cardBounds[index].height / 2
    );
  }
  function getCardHeight(index: number) {
    const rightBoxBounds = document
      .getElementById("right-box")
      ?.getBoundingClientRect();
    const cards = document.querySelectorAll("#right-box .link-card");
    const cardBounds: Array<DOMRect> = [];
    cards.forEach((card) => cardBounds.push(card.getBoundingClientRect()));
    if (!rightBoxBounds || !cardBounds.length || !cardBounds[index]) {
      return 0;
    }
    return (
      rightBoxBounds.height -
      (rightBoxBounds.bottom - cardBounds[index].bottom) -
      cardBounds[index].height / 2
    );
  }
  function drawTriangle(
    ctx: CanvasRenderingContext2D,
    left: number,
    right: number,
    y: number
  ) {
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left, y + 10);
    ctx.lineTo(right, y);
    ctx.lineTo(left, y - 10);
    ctx.lineTo(left, y);
    ctx.fill();
    ctx.stroke();
  }
  function drawFullLine(index: number, color: string, lineWidth: number) {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const canvasBounds = canvas?.getBoundingClientRect();
    if (!canvasBounds || !ctx) return;

    const startingBoxClass = document.getElementById("menu-list")?.className;
    const startingBoxIndex = Number(startingBoxClass?.split("active:").pop());

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(0, getStartingHeight(startingBoxIndex));
    ctx.lineTo(canvasBounds.width / 2, getStartingHeight(startingBoxIndex));
    ctx.lineTo(canvasBounds.width / 2, getCardHeight(index));
    ctx.lineTo(canvasBounds.width - 25, getCardHeight(index));
    ctx.stroke();
    drawTriangle(
      ctx,
      canvasBounds.width - 35,
      canvasBounds.width - 10,
      getCardHeight(index)
    );
  }
  function drawDefault() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const leftBox = document.getElementById("left-box");
    const rightBox = document.getElementById("right-box");
    const cards = document.querySelectorAll("#right-box .link-card");
    cards.forEach((card) => {
      card.addEventListener("focus", focus, true);
      card.addEventListener("blur", blur, true);
      card.addEventListener("mouseover", mouseIn);
      card.addEventListener("mouseout", mouseOut);
    });
    if (canvas && leftBox && rightBox && cards.length) {
      canvas.width = canvas?.offsetWidth; // lines super blurry without this
      canvas.height = canvas?.offsetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      cards.forEach((_, index) => drawFullLine(index, "black", 3));

      const secondaryNavClassName = document.getElementById(
        "secondary-menu-list"
      )?.className;
      const secondaryNavActive = Number(
        secondaryNavClassName?.split("active:").pop()
      );
      if (!isNaN(secondaryNavActive)) {
        drawFullLine(secondaryNavActive, "#831843", 10);
      }
    }
  }
  function focus(e: any) {
    drawFullLine(e.target.id, "#831843", 10);
  }
  function blur() {
    drawDefault();
  }
  function mouseIn(e: any) {
    drawFullLine(e.target.id, "#831843", 10);
  }
  function mouseOut() {
    drawDefault();
  }
  function reload() {
    drawDefault();
  }
  window.addEventListener("resize", mouseOut, true);
  document.addEventListener("astro:page-load", reload);
  drawDefault();
}
export default UseDrawLines;
