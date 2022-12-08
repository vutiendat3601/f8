const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const timeStart = $(".time-start");
const timeEnd = $(".time-end");
const preBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const uploadInp = $("#upload-file");
const uploadBtn = $(".btn-upload");

const contextPath = "https://vutiendat3601.github.io/f8/music-player";

let songList = $$(".song");

let timeStartValue = 0;
let timeEndValue = 0;

// Utils
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function secondsToMinutesAndSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    let seconds = (totalSeconds % 60).toFixed(0);
    const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    return result;
}

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    playedSongs: new Set(),
    songs: [
        {
            "id": 1,
            "name": "24h",
            "singer": "Ly Ly",
            "location": "/assets/music/24h_lyly.mp3",
            "thumbnail": "/assets/img/song/24h_thumbnail.jpg"
        },
        {
            "id": 2,
            "name": "ĐỪNG YÊU NỮA, EM MỆT RỒI",
            "singer": "MIN",
            "location": "/assets/music/dung-yeu-nua-em-met-roi_min.mp3",
            "thumbnail": "/assets/img/song/dung-yeu-nua-em-met-roi_thumbnail.jpg"
        },
        {
            "id": 3,
            "name": "Nụ Cười 18 20",
            "singer": "Doãn Hiếu",
            "location": "/assets/music/nu-cuoi-18-20_doan-hieu.mp3",
            "thumbnail": "/assets/img/song/nu-cuoi-18-20_thumbnail.jpg"
        },
        {
            "id": 4,
            "name": "Tự Sự",
            "singer": "Orange",
            "location": "/assets/music/tu-su_orange.mp3",
            "thumbnail": "/assets/img/song/tu-su_thumbnail.jpg"
        },
        {
            "id": 5,
            "name": "Vợ Tuyệt Vời Nhất",
            "singer": "Vũ Duy Khánh",
            "location": "/assets/music/vo-tuyet-voi-nhat_vu-duy-khanh.mp3",
            "thumbnail": "/assets/img/song/vo-tuyet-voi-nhat_thumbnail.jpg"
        },
        {
            "id": 6,
            "name": "Dreamers",
            "singer": "Jung Kook",
            "location": "/assets/music/dreamers_jung-kook.mp3",
            "thumbnail": "/assets/img/song/dreamers_thumbnail.jpg"
        },
        {
            "id": 7,
            "name": "Nơi Này Có Anh",
            "singer": "Sơn Tùng MTP",
            "location": "/assets/music/noi-nay-co-anh_son-tung-mtp.mp3",
            "thumbnail": "/assets/img/song/noi-nay-co-anh_thumbnail.jpg"
        },
        {
            "id": 8,
            "name": "Đường Tôi Chở Em Về",
            "singer": "Bùi Trường Linh",
            "location": "/assets/music/duong-toi-cho-em-ve_bui-truong-linh.mp3",
            "thumbnail": "/assets/img/song/duong-toi-cho-em-ve_thumbnail.jpg"
        },
        {
            "id": 9,
            "name": "Mình Yêu Từ Bao Giờ",
            "singer": "Miu Lê",
            "location": "/assets/music/minh-yeu-tu-bao-gio_miu-le.mp3",
            "thumbnail": "/assets/img/song/minh-yeu-tu-bao-gio_thumbnail.jpg"
        },
        {
            "id": 10,
            "name": "Mặt Mộc",
            "singer": "VAnh",
            "location": "/assets/music/mat-moc_vanh.mp3",
            "thumbnail": "/assets/img/song/mat-moc_thumbnail.jpg"
        },
        {
            "id": 11,
            "name": "Bài Này Không Để Đi Diễn",
            "singer": "Anh Tú",
            "location": "/assets/music/bai-nay-khong-de-di-dien_anh-tu.mp3",
            "thumbnail": "/assets/img/song/bai-nay-khong-de-di-dien_thumbnail.jpg"
        }],
    preSong: function () {
        this.currentIndex--;
        this.currentIndex = this.currentIndex >= 0 ? this.currentIndex : this.songs.length - 1;
        this.loadCurrentSong();
    },
    nextSong: function () {
        this.currentIndex++;
        this.currentIndex = this.currentIndex < this.songs.length ? this.currentIndex : 0;
        this.loadCurrentSong();
    },
    randomSong: function () {
        this.playedSongs.add(this.currentIndex);
        if (this.playedSongs.size == this.songs.length) {
            this.playedSongs.clear();
            this.playedSongs.add(this.currentIndex);
        }
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
            console.log(this.currentIndex);
        } while (this.playedSongs.has(this.currentIndex));
        this.loadCurrentSong();
    },
    changeSongRender: function (oldIndex) {
        $(`.song[song-id='${oldIndex}']`)?.classList.remove("active");
        $(`.song[song-id='${this.currentIndex}']`).classList.add("active");
    },
    render: function () {
        let i = 0;
        const htmls = this.songs.map(song =>
            `<div class="song" song-id="${i++}">
                <div class="thumb"
                    style="background-image: url('${song.thumbnail}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        );
        $(".playlist").innerHTML = htmls.join("");
        this.changeSongRender();
        songList = $$(".song");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
        this.songs.map(song => {
            song.location = `${contextPath}${song.location}`;
            song.thumbnail = `${contextPath}${song.thumbnail}`;
        });
    },
    handlEvents: function () {
        const cd = $(".cd");
        const cdWidth = $(".cd").offsetWidth;
        const _this = this;

        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newCdWidth = cdWidth - scrollTop;
            newCdWidth = newCdWidth >= 0 ? newCdWidth : 0;
            cd.style.width = `${newCdWidth}px`;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                this.playedSongs.clear();
                _this.isPlaying = true;
                audio.play();
            }
        }

        preBtn.onclick = () => {
            let oldIndex = this.currentIndex;
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                this.playedSongs.clear();
                _this.preSong();
            }
            this.changeSongRender(oldIndex);
            audio.play();
        }

        nextBtn.onclick = () => {
            let oldIndex = this.currentIndex;
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                this.playedSongs.clear();
                _this.nextSong();
            }
            audio.play();
            this.changeSongRender(oldIndex);
        }

        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        }

        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        songList.forEach(songItem => {
            songItem.onclick = () => {
                let oldIndex = _this.currentIndex;
                let songId = songItem.getAttribute("song-id")
                _this.currentIndex = songId;
                _this.changeSongRender(oldIndex);
                _this.loadCurrentSong();
                audio.play();
            }
        });

        const cdThumbAnimation = cdThumb.animate([{ transform: "rotate(360deg)" }],
            { duration: 16000, iterations: Infinity });
        cdThumbAnimation.pause();

        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimation.play();
        }
        audio.onpause = () => {
            player.classList.remove("playing");
            _this.isPlaying = false;
            cdThumbAnimation.pause();
        }
        audio.ontimeupdate = () => {
            timeStartValue = audio.currentTime;
            timeStart.innerHTML = function () {
                if (timeStartValue <= timeEndValue) {
                    progress.value = timeStartValue;
                    return secondsToMinutesAndSeconds(timeStartValue);
                }
                progress.max = timeEndValue;
                progress.value = timeEndValue;
                return secondsToMinutesAndSeconds(timeEndValue);
            }();
        }
        audio.onloadedmetadata = () => {
            timeEndValue = audio.duration;
            progress.max = timeEndValue;
            timeEnd.innerHTML = secondsToMinutesAndSeconds(timeEndValue);
        }

        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        progress.onchange = (e) => {
            audio.currentTime = e.target.value;
        }
    },
    loadCurrentSong: function () {
        heading.textContent = `${this.currentSong.name} - ${this.currentSong.singer}`;
        cdThumb.style.backgroundImage = `url("${this.currentSong.thumbnail}")`;
        audio.src = this.currentSong.location;
        timeStartValue = 0;
        progress.value = timeStartValue;
    },
    start: function () {

        this.defineProperties();

        this.render();

        this.handlEvents();

        this.loadCurrentSong();

    }
}
app.start();

