(function ($) {
  "use strict";
  var musicData = [],
      musicUri  = [],
      musics = [],
      tasks = ["SURVIVALゲージでクリア", "ULTIMATEゲージでクリア", "FULL COMBO", "GRADE S", "GRADE S+", "GRADE S++",
               "CLEAR RATE 98%", "CLEAR RATE 99%", "CLEAR RATE 100%", "ALL Flawless"],
      task_prob = [50, 30, 30, 50, 30, 20, 50, 20, 10, 1],
      difficulty = ["EASY", "NORMAL", "HARD", "MASTER", "UNLIMITED"];
  var probsum = task_prob.reduce(function(x, y) { return x + y; });

  function gen_task() {
    var prob_table = [];
    task_prob.forEach(function (v) {
      prob_table.push(v / probsum);
    });

    var music = musics[Math.round(Math.random() * musics.length)];
    var difficulty_num = Math.round(Math.random() * music.levels.length);
    if (music.levels.length <= difficulty_num || music.levels[difficulty_num] == "") {
      return gen_task();
    }

    for (var i = 0; i < prob_table.length - 1; i++) {
      prob_table[i + 1] = prob_table[i + 1] + prob_table[i];
    }

    var task;
    var rand = Math.random();
    for (var i = 0; i < prob_table.length - 1; i++) {
      if (rand < prob_table[i]) {
        task = tasks[i];
        break;
      }
    }

    return music.title + " [" + difficulty[difficulty_num] + " " + music.levels[difficulty_num] + "] を \"" + task + "\"";
  }

  $.getJSON("json/revdata.json?" + (new Date).getTime(), function (json) {
    json.forEach(function (v) { musicData.push(v); });
  }).then(function () {
    // ここのいい書き方を知りたい
    var Music = (function () {
      function Music (title, levels) {
        this.title = title;
        this.levels = levels;
      }

      return Music;
    })();

    musicData.forEach(function (v) {
      var o = musicUri.find(function (m) { return m.title === v.title; });
      musics.push(new Music(v.title, v.level));
    });

    $("#gen").on("click", function (e) {
      $("#task").text(gen_task());
    });
  });

})(jQuery);
