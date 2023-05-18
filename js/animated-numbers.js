function animate(obj, initVal, lastVal, duration) {

    let startTime = null;
    let currentTime = Date.now();
    
        const step = (currentTime ) => {
    
            if (!startTime) {
                startTime = currentTime ;
            }
    
            const progress = Math.min((currentTime  - startTime) / duration, 1);
    
            obj.innerHTML = Math.floor(progress * (lastVal - initVal) + initVal);
    
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
            else {
                window.cancelAnimationFrame(window.requestAnimationFrame(step));
            }
        };
    
        window.requestAnimationFrame(step);
    };
    
    let text1 = document.getElementById('animated-1');
    let text2 = document.getElementById('animated-2');
    
    function load() {
        animate(text1, 0, 11, 2000);
        animate(text2, 0, 84, 2000);
    }
    
    // this function runs every time you are scrolling
    $.first_time = true;
    
    $(window).scroll(function() {
        if($.first_time == true) {
            let targetElement = "#animated-wrapper";
    
            let top_of_element = $(targetElement).offset().top;
            let bottom_of_element = $(targetElement).offset().top + $(targetElement).outerHeight();
            let bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
            let top_of_screen = $(window).scrollTop();
        
            if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
                load()
                $.first_time = false;
            } else {
                // the element is not visible, do something else
            }
        } else {
    
        }
    });