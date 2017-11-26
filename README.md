FireLoaclSWF
============
2017.11.26

+新增57可用版本，UC使用方法见https://github.com/Endor8/userChrome.js/tree/master/userChrome。

youku tudou在57+上已默认启用HTML5，因此已默认禁用相关规则，请用abp/ubo/YAPfY过滤广告。

iqiyi建议在TM上使用https://greasyfork.org/scripts/28356来屏蔽广告。

pptv播放器过老造成无法播放且可用abp/ubo过滤，因此不再支持此网站。


2016.11.19

优酷播放器底部问题可以临时用css修正下

@-moz-document domain("v.youku.com"){
    .danmuoff .vpactionv5_iframe_wrap {top: auto !important;}
    .play_area{margin-bottom: 70px !important;}
}

我修改过的UC版本地视频网站播放器（Firefox专用）打包版，请解压swf.rar到Profiles\chrome\后食用。

支持的网站：youku tudou iqiyi letv sohu。

UC脚本修改自15536900和cinhoo，SWF播放器大部分采用15536900@kafan的，iqiyi_out/Letv_live播放器采用catcat520@kafan的。

修改原理见我原帖：https://g.mozest.com/viewthread.php?tid=43130&page=2#pid300698

感谢 cinhoo,15536900,catcat520

Git@OSC地址：https://git.oschina.net/jnzk/FireLocalSWF