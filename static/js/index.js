let height = $('.content').css('height');
let width = $('.content').css('width');

$('canvas').attr('height',height);
$('canvas').attr('width',width);

const canvas = jQuery('canvas')[0];
const ctx = canvas.getContext('2d');

const terminal = new Terminal(
    ctx,
    parseInt(height.substr(0,height.length-2)),
    parseInt(width.substr(0,width.length-2)),
    'Eason@blog'
);

terminal.render();



// document.getElementById('hidden-input-' + parameters.ctx.cText.elemId).focus();
// window.scroll(0, ctx1.canvas.offsetTop);
