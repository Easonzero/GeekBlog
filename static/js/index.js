let content = $('.terminal');
let terminalCanvas = $('#terminal-canvas');
let bgCanvas = $('#bg-canvas');

let height = content.css('height');
let width = content.css('width');

terminalCanvas.attr('height',height);
terminalCanvas.attr('width',width);
bgCanvas.attr('width',window.screen.width);
bgCanvas.attr('height',window.screen.height);

const canvas = jQuery('#terminal-canvas')[0];
const canvasBg = jQuery('#bg-canvas')[0];
const ctx = canvas.getContext('2d');
const ctxBg = canvasBg.getContext('2d');

const terminal = new Terminal(
    ctx,
    parseInt(height.substr(0,height.length-2)),
    parseInt(width.substr(0,width.length-2)),
    'Eason@blog'
);

const hacker = new Hacker(
    ctxBg,
    window.screen.width,
    window.screen.height
);

terminal.render();
