// ==UserScript==
// @name        DB9Radio - Song History
// @author      Perilune
// @namespace   https://github.com/soranosita
// @match       https://*.db9radio.net/*
// @icon        https://www.db9radio.net/favicon.ico
// @version     1.0
// ==/UserScript==


if (window.location.pathname === '/7History.htm') {
  replaceHtml();
  getHistory();
} else {
  updateMenuBar();
}


async function getHistory() {
  fetch('https://raw.githubusercontent.com/soranosita/db9/main/data/previous_songs.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("music-container");
      container.innerHTML = "";

      for (let i = data.length - 1; i >= data.length - 10; i--) {
        const timestamp = data[i].started;
        let border;
        let timeAgo;

        if (i == data.length - 1) {
          border = "2.5px solid #F99C30";
          timeAgo = '<span id="elapsed-time" style="color: #ddd"></p>'
        } else {
          border = "1px solid #CCC";
          timeAgo = getTimePlayedAt(timestamp);
        }

        const musicBox = getMusicBox(data[i].song, data[i].album, data[i].imageUrl, timeAgo, border);
        container.append(musicBox);

        if (i == data.length - 1) {  // TODO: improve this
          updateElapsedTime(timestamp);
          setInterval(() => {
            updateElapsedTime(timestamp);
          }, 1000);
        }
      }
  })
}


function formatTime(hours, minutes, seconds) {
    return `Playing: ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


function updateElapsedTime(timestamp) {
  const currentTime = Math.floor(Date.now() / 1000);
  const elapsedTime = currentTime - timestamp;

  const hours = Math.floor(elapsedTime / 3600);
  const remainingSeconds = elapsedTime % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = formatTime(hours, minutes, seconds);
  document.getElementById("elapsed-time").textContent = formattedTime;
}


function getTimePlayedAt(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const now = new Date();
  let formattedDate;

  if (now.toDateString() === date.toDateString()) {
    formattedDate = "today ";
  } else if (new Date(now - 86400000).toDateString() === date.toDateString()) {
    formattedDate = "yesterday ";
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    formattedDate = `on ${month}/${day} `;
  }

  return `Played ${formattedDate}at ${formattedTime}`;
}


function getMusicBox(song, album, imageUrl, timeAgo, border) {
  const isLive = album === "LIVE";
  const div = document.createElement("div");
  div.className = "music-box";
  div.style = `display: flex;align-items: center;border: ${border};padding: 10px;width: 100%;max-width: 300px;background-color: #111;margin-left: 60px;`;

  div.innerHTML = `
    <img class="music-image" src="${imageUrl}" style="width: 60px;margin-right: 20px;border-radius: 5px;">
    <div class="music-details" style="overflow: hidden;">
      <p class="song-title" title="${song}" style="font-size: 17px;color: #fff;font-weight: bold;margin: 0px;overflow: hidden;/*white-space: nowrap;*/text-overflow: ellipsis; margin-bottom: 2px">${song}</p>
      <p class="album-title" title="${album}" style="font-size: 14px;color: #EE962A;${isLive ? "font-style: italic;" : ""}margin-top: 0px;margin-bottom: 0px;">${album == "null" ? "N/A" : album}</p>
      <p class="started" style="font-size: 12px;color: #777;margin-top: 5px;margin-bottom: 0px;">${timeAgo}</p>
    </div>`;

  return div;
}


function updateMenuBar() {
  const menubar = document.getElementById("menubar");

  const historyButton = document.createElement("a");
  historyButton.className = "style13";
  historyButton.href = "7History.htm";
  historyButton.textContent = "» History «";
  menubar.append(historyButton);

  const elements = menubar.querySelectorAll("a");
  elements.forEach(elem => {
    elem.style.margin = "0px 1px";
    elem.style.padding = "3px 5.3px 0px 5.3px";
  });
  elements[0].style.marginLeft = "7px";
}


function replaceHtml() {
  document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link type="text/css" rel="stylesheet" href="CSS/banner-styles.css">
    <title>DB9 Radio :: Internet Underground Dance Music</title>
    <link rel="stylesheet" href="CSS/db9radio.css" type="text/css">
    <script type="text/javascript" src="Jscript/img.js"></script>
    <script type="text/javascript" src="Jscript/global.js"></script>
    <style type="text/css">
      body {
        overflow-y: scroll;
      }
    </style>
  </head>
  <body>
    <div id="main_column">
      <div id="header_wrap">
        <div id="logo">
          <img src="Images/logo_450.png" alt="logo">
          <div></div>
        </div>
        <div id="menubar">
          <a href="http://www.db9radio.net" class="style13" style="margin: 0px 1px 0px 7px; padding: 3px 5.3px 0px;">» News «</a>
          <a href="2Schedule.htm" class="style13" style="margin: 0px 1px; padding: 3px 5.3px 0px;">» Schedule «</a>
          <a href="3DjProfiles.htm" class="style13" style="margin: 0px 1px; padding: 3px 5.3px 0px;">» DJ Profiles «</a>
          <a href="4Chatroom.htm" class="style13" style="margin: 0px 1px; padding: 3px 5.3px 0px;">» Chatroom «</a>
          <a href="5DjApplication.htm" class="style13" style="margin: 0px 1px; padding: 3px 5.3px 0px;">» DJ Application «</a>
          <a href="6Contact.htm" class="style13" style="margin: 0px 1px; padding: 3px 5.3px 0px;">» Contact «</a>
          <a href="7History.htm" class="style13" style="margin: 0px 1px; padding: 3px 5.3px 0px;">» History «</a>
        </div>
        <div id="radiobar" style="left: 0px; height: 67px" class="auto-style1">
          <font class="radiotag">ON AIR: </font>
          <span id="cc_strinfo_trackartist_andorint" class="cc_streaminfo"></span> - <span id="cc_strinfo_tracktitle_andorint" class="cc_streaminfo"></span> [320kbps] <br>
          <a href="db9radio.pls" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage('Winamp','','/Images/winampo.png',1)">
            <img src="/Images/winamp.png" alt="Tune in!" name="Winamp" border="0" height="30" width="30">
          </a>&nbsp;&nbsp; <a href="playlist.ram" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage('Real','','/Images/realo.png',1)">
            <img src="/Images/real.png" alt="Tune in!" name="Real" border="0" height="30" width="30">
          </a> &nbsp;&nbsp; <a href="playlist.asx" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage('WMP','','/Images/windowsmediao.png',1)">
            <img src="/Images/windowsmedia.png" alt="Tune in!" name="WMP" border="0" height="30" width="30">
          </a>&nbsp;&nbsp;
        </div>
      </div>
      <br>
      <div id="history_wrapper">
        <center>
          <img src="https://i.imgur.com/H4RS4iA.png" height="80">
        </center>
        <div id="music-container" style="display: flex;flex-wrap: wrap;justify-content: flex-start;gap: 20px;max-width: 800px;margin: 0 auto;">
          <p style="margin: 0px auto;">Loading...</p>
        </div>
      </div>
    </div>
    <div id="footer">
      <font class="footernote">Site and design © 2014 DB9-RADiO</font>
    </div>
    <script language="javascript" type="text/javascript" src="https://eu6.fastcast4u.com:2199/system/streaminfo.js"></script>`);
}
