$(function() {

    $('.navbar-toggle').click(function() {
        $(this).toggleClass('act');
            if($(this).hasClass('act')) {
                $('.main-menu').addClass('act');
            }
            else {
                $('.main-menu').removeClass('act');
            }
    });

    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.site-header',
        offset: 10
    });

	/* Progress bar */
    var $section = $('.section-skills');
    function loadDaBars() {
	    $('.progress .progress-bar').progressbar({
	        transition_delay: 500
	    });
    }
    
    $(document).bind('scroll', function(ev) {
        var scrollOffset = $(document).scrollTop();
        var containerOffset = $section.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset) {
            loadDaBars();
            // unbind event not to load scrolsl again
            $(document).unbind('scroll');
        }
    });

    /* Counters  */
    if ($(".section-counters .start").length>0) {
        $(".section-counters .start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
    };

	// another custom callback for counting to infinity
	$('#infinity').data('countToOptions', {
		onComplete: function (value) {
		  count.call(this, {
		    from: value,
		    to: value + 1
		  });
		}
	});

	$('#infinity').each(count);

	function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

    // Navigation overlay
    var s = skrollr.init({
            forceHeight: false,
            smoothScrolling: false,
            mobileDeceleration: 0.004,
            mobileCheck: function() {
                //hack - forces mobile version to be off
                return false;
            }
    });
    
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const birdSize = 30;
const pipeWidth = 50;
const pipeGap = 150;
const gravity = 0.6;
const lift = -15;
let birdY = canvas.height / 2;
let birdVelocity = 0;
let pipes = [];
let pipeInterval = 1500;
let lastPipeTime = 0;
let score = 0;
let gameInterval;
let isGameRunning = false;

// Get buttons and scoreboard
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');

// Event listener for flapping
document.addEventListener('keydown', () => {
    if (isGameRunning) {
        birdVelocity = lift;
    }
});

// Event listeners for buttons
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Draw the bird
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, birdSize, birdSize);
}

// Draw the pipes
function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

// Update the bird's position and physics
function updateBird() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY + birdSize > canvas.height || birdY < 0) {
        gameOver();
    }
}

// Move pipes and check for collisions
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
        
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }

        if (50 < pipe.x + pipeWidth && 50 + birdSize > pipe.x &&
            (birdY < pipe.top || birdY + birdSize > canvas.height - pipe.bottom)) {
            gameOver();
        }
    });

    if (Date.now() - lastPipeTime > pipeInterval) {
        lastPipeTime = Date.now();
        const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: canvas.height - topHeight - pipeGap
        });
    }
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    alert('Game Over! Your score was ' + score);
}

// Update the game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    scoreElement.innerText = score;
}

// Start the game
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        gameInterval = setInterval(update, 1000 / 60);
    }
}

// Restart the game
function restartGame() {
    clearInterval(gameInterval);
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    scoreElement.innerText = score;
    lastPipeTime = Date.now();
    startGame();
}

