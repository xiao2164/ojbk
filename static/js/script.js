console.log('%cCopyright © 2024 zyyo.net',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
tc[0].addEventListener('click', function (event) {
    pop();
});
tc_main[0].addEventListener('click', function (event) {
    event.stopPropagation();
});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Light";
    var tanChiShe = document.getElementById("tanChiShe");

    function changeTheme(theme) {
        tanChiShe.src = "./static/svg/snake-" + theme + ".svg";
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }

    var Checkbox = document.getElementById('myonoffswitch')
    Checkbox.addEventListener('change', function () {
        if (themeState == "Dark") {
            changeTheme("Light");
        } else if (themeState == "Light") {
            changeTheme("Dark");
        } else {
            changeTheme("Dark");
        }
    });

    if (themeState == "Dark") {
        Checkbox.checked = false;
    }

    changeTheme(themeState);

    var fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.zIndex = '10000';
    fpsElement.style.position = 'fixed';
    fpsElement.style.left = '0';
    document.body.insertBefore(fpsElement, document.body.firstChild);

    var showFPS = (function () {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        var fps = 0,
            last = Date.now(),
            offset, step, appendFps;

        step = function () {
            offset = Date.now() - last;
            fps += 1;

            if (offset >= 1000) {
                last += offset;
                appendFps(fps);
                fps = 0;
            }

            requestAnimationFrame(step);
        };

        appendFps = function (fpsValue) {
            fpsElement.textContent = 'FPS: ' + fpsValue;
        };

        step();
    })();

    // 已切换到 Giscus，无需自研留言表单逻辑

    // Music player logic
    var audioEl = document.getElementById('music-audio');
    var sourceEl = document.getElementById('music-source');
    var playBtn = document.getElementById('music-play');
    var prevBtn = document.getElementById('music-prev');
    var nextBtn = document.getElementById('music-next');
    var titleEl = document.getElementById('music-title');
    var musicFolder = 'yinyue/';
    var musicFiles = [];
    var currentIdx = 0;

    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }
        return array;
    }

    function isPlayable(file) {
        var mime = getMimeByExt(file);
        if (!mime) return false;
        try { return !!audioEl.canPlayType && audioEl.canPlayType(mime) !== ''; } catch(e) { return false; }
    }

    function pickRandomThree(all) {
        if (!all || all.length === 0) return [];
        // 先按浏览器支持过滤
        var arr = all.filter(isPlayable);
        if (arr.length === 0) return [];
        shuffle(arr);
        return arr.slice(0, Math.min(3, arr.length));
    }

    function getMimeByExt(filename) {
        var lower = (filename || '').toLowerCase();
        if (lower.endsWith('.mp3')) return 'audio/mpeg';
        if (lower.endsWith('.ogg')) return 'audio/ogg';
        if (lower.endsWith('.wav')) return 'audio/wav';
        if (lower.endsWith('.flac')) return 'audio/flac';
        return '';
    }

    function setTrack(idx) {
        if (!musicFiles[idx]) return;
        currentIdx = idx;
        // 生成绝对地址，并对中文/空格等进行编码
        var fname = encodeURIComponent(musicFiles[idx]);
        var src = new URL(musicFolder + fname, window.location.href).toString();
        var mime = getMimeByExt(musicFiles[idx]);
        if (sourceEl) {
            sourceEl.src = src;
            if (mime) sourceEl.type = mime; else sourceEl.removeAttribute('type');
            // 变更 source 后需调用 load()
            audioEl.load();
        } else {
            audioEl.src = src;
        }
        titleEl.textContent = musicFiles[idx];
        try { console.log('Now playing src:', src, 'mime:', mime); } catch(e) {}
    }

    function playPause() {
        if (!audioEl.src && !(sourceEl && sourceEl.src)) return;
        if (audioEl.paused) {
            var p = audioEl.play();
            if (p && typeof p.catch === 'function') { p.catch(function(){}); }
        } else {
            audioEl.pause();
        }
    }

    var isLoadingTrack = false;

    function loadAndPlay(index) {
        if (!musicFiles[index]) return;
        isLoadingTrack = true;
        try { audioEl.pause(); } catch(e) {}
        setTrack(index);
        var onReady = function(){
            audioEl.removeEventListener('canplay', onReady);
            isLoadingTrack = false;
            var p = audioEl.play();
            if (p && typeof p.catch === 'function') { p.catch(function(){}); }
        };
        audioEl.addEventListener('canplay', onReady, { once: true });
    }

    function nextTrack() {
        if (musicFiles.length === 0 || isLoadingTrack) return;
        var ni = (currentIdx + 1) % musicFiles.length;
        loadAndPlay(ni);
    }

    function prevTrack() {
        if (musicFiles.length === 0 || isLoadingTrack) return;
        var pi = (currentIdx - 1 + musicFiles.length) % musicFiles.length;
        loadAndPlay(pi);
    }

    if (audioEl && playBtn && prevBtn && nextBtn && titleEl) {
        audioEl.preload = 'metadata';
        audioEl.volume = 1.0;
        audioEl.controls = false;
        // 由于前端无法列目录，这里请把你的歌曲文件名填到列表中
        // 例如：['a.mp3','b.mp3','c.mp3','d.mp3']
        // 只会随机选择 3 首
        var allSongs = [
            '我怀念的.mp3',
            '借口.mp3',
            '你听得到.mp3',
            '爱你没差.mp3',
            '晴天.mp3',
            '我走后.mp3',
            '烟花易冷.mp3',
            '勇气.mp3',
            // TODO: 在此处按实际文件名填写，如 'song1.mp3'
        ];

        if (allSongs.length > 0) {
            var playable = allSongs.filter(isPlayable);
            musicFiles = playable.slice(0, 8); // 使用前 8 首可播放的歌
            if (musicFiles.length > 0) {
                try { console.log('Playlist:', musicFiles); } catch(e) {}
                setTrack(0);
            } else {
                titleEl.textContent = '当前浏览器不支持这些音频格式';
            }
        } else {
            titleEl.textContent = '未配置歌曲文件名';
        }

        playBtn.addEventListener('click', playPause);
        nextBtn.addEventListener('click', nextTrack);
        prevBtn.addEventListener('click', prevTrack);
        audioEl.addEventListener('ended', nextTrack);
        audioEl.addEventListener('error', function(){
            // 播放失败，自动跳到下一首
            nextTrack();
        });
        audioEl.addEventListener('play', function(){
            playBtn.textContent = '⏸';
        });
        audioEl.addEventListener('pause', function(){
            playBtn.textContent = '▶️';
        });
    }
});

var pageLoading = document.querySelector("#zyyo-loading");
window.addEventListener('load', function() {
    setTimeout(function () {
        pageLoading.style.opacity = '0';
    }, 100);
});

