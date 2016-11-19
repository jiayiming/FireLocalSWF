FireLoaclSWF
============
2016.11.19
优酷播放器底部问题可以临时用css修正下
@-moz-document domain("v.youku.com"){
    .danmuoff .vpactionv5_iframe_wrap {top: auto !important;}
    .play_area{margin-bottom: 70px !important;}
}

<font color=red>注意！！！：已放弃打包所有播放器成swf.rar的方式更新，方便单独更新。</font>

我修改过的UC版本地视频网站播放器（Firefox专用）打包版，请解压swf.rar到Profiles\chrome\后食用。

支持的网站：youku ku6 iqiyi tudou letv pptv sohu pps 17173。

UC脚本修改自cinhoo，SWF播放器采用15536900@kafan的，iqiyi_out/PPTV_live/17173/Letv_live播放器采用catcat520@kafan的。

修改原理见我原帖：https://g.mozest.com/viewthread.php?tid=43130&page=2#pid300698

感谢 cinhoo,15536900,catcat520

Git@OSC地址：https://git.oschina.net/jnzk/FireLocalSWF