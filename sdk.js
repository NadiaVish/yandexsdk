var ysdk;
var player;
var sdk;
var prev_lb_result = 0;
var rewarded_watched = false

//SDK
runOnStartup(async runtime => {
  runtime.addEventListener("beforeprojectstart", () =>   OnBeforeProjectStart(runtime));})

async function OnBeforeProjectStart(runtime) {
//sdk script
(function(d) {
        var t = d.getElementsByTagName('script')[0];
        var s = d.createElement('script');
        s.src = 'https://yandex.ru/games/sdk/v2';
        s.async = true;
        t.parentNode.insertBefore(s, t);
        s.onload = initSDK;
    })(document);

//sdk init 	
function initSDK() {
   YaGames
     .init()
      .then(ysdk_ => {
         ysdk = ysdk_;
		 console.info("sdk loaded");
		 sdk = true;
		 return ysdk
         })
	   .catch(console.error)
 }
}



// functions 	
function api_ready(){
   ysdk.features.LoadingAPI.ready()
   console.info("api ready")
}

function show_fullscreen_ad(runtime) {
	ysdk.adv.showFullscreenAdv({
	   callbacks: {
	     onClose: () => {

	     },
	     onOpen: () => {

	     },
	     onError: () => {
	       console.info('Error');
	     },
	     onOffline: () => {console.info('Offline')}
}})}
	
function show_rewarded_ad(runtime) {
  if (sdk) {
	  ysdk.adv.showRewardedVideo({
       callbacks: {
         onOpen: () => {},
	       onRewarded: () => {},
	       onClose: () => {},
         onError: (e) => {console.log('Error'), e;} 
       }
})}}

function get_player(runtime) {
   return ysdk.getPlayer().then(_player => {
      player = _player;
      console.info("player_loaded");
      return player;
})}

function save_score(score, best_score){
  if(ysdk) {
    player.setStats({
	      saved_score: score,
		    best_score_saved: best_score,
	      });
 	  save_lb_result(best_score);
    console.log("saved score: "+ score)
   }else {return YaGames.init().then (()=> {save_score(score)})}
 }
 
function load_score(runtime) {
   return player.getStats().then(score_data => {
     if (score_data.best_score_saved != undefined) {
		    runtime.globalVars.best_score = score_data.best_score_saved;}
	   if (score_data.saved_score != undefined){
	     runtime.globalVars.score = score_data.saved_score;
		   api_ready()
		 }
	   else{
     // first open
	   api_ready();
	   }
})}
 
function save_lb_result(score_lb){
  if (ysdk.isAvailableMethod("leaderboards.setLeaderboardScore")){
    if (score_lb>prev_lb_result){
	    prev_lb_result = score_lb;
      ysdk.getLeaderboards()
	      .then(lb => {
           lb.setLeaderboardScore("score", score_lb);
	          console.info("lb saved")
        })
}}} 

function get_language(runtime){
  var lang = ysdk.environment.i18n.lang
  //runtime.globalVars.language = lang
  console.info("lang is "+lang)
  //runtime.callFunction("load_language", lang)
}

