var listConfig = {
	server:"/",
	users: function (room, viewers, me) {
		var currStreamers = $$("onlineStreams");
		currStreamers.clearAll();

		if (listConfig.name)
			currStreamers.add({ 
				id: -1, 
				img: "images/avatar.png", 
				title: listConfig.name + " ( you )" });

		for (var key in viewers){
			var variable = viewers[key];
			currStreamers.add ({
				id: variable.easyrtcid,
				img: "images/avatar.png",
				title: variable.username
			});
		}
	}
};

var onlineStreams = {
	header : "Streams",
	view : "list",
	id : "onlineStreams",
	template : `
		<div class='contactPaneDiv'>
			<img class="contactIcon" src="#img#"/>
			<span class="contactTextDiv">#title#</span>
		</div>
	`,
	item : {
		height: 80,
		width: 300,
	},
	select:true, scroll: true,
	on:{ onBeforeSelect: (userId) => view(userId) }
};

var videoChat = {
	css:"absarea",
	template:`<div class='localVideoDiv'><video id='localVideo' width></div>
				<div class='remoteVideoDiv'><video id='remoteVideo'></div>`
};

function connect(room) {
	easyrtc.joinRoom('myStream', null, null, null);
	easyrtc.setVideoDims(300,240);
	easyrtc.setUsername (room.name);
	easyrtc.setRoomOccupantListener(room.users);
	easyrtc.setSocketUrl(room.server);
	easyrtc.easyApp("videoChatRoom", "localVideo", ["remoteVideo"], function(id) {
		listConfig.$userId = id
	}, function(error){
		webix.message({ type:"error", text: error});
	});

	easyrtc.setAcceptChecker( function(callerId, cb) {
      var name = easyrtc.idToName(callerId);
      $$("endcall").show();
      $$("status").setValue('Viewed By: ' + name);
      cb(true);
    });

	easyrtc.setPeerClosedListener(function(){
		if ($$("endcall").isVisible()){
			$$("endcall").hide();
			$$("status").setValue("No viewers");
			webix.message("You were disconnected");
		}
	});	
}

function view (userId) {
	if (userId < 0) return false;

	$$("status").setValue("Connecting to stream")
	easyrtc.call(
		userId,
		function(streamerId) { 
			$$("endcall").show();
			$$("status").setValue("Viewing: " + easyrtc.idToName(streamerId));
		},
		function(errorMessage) { 
			webix.message({
				type:"error", text:errorMessage
			});
		},
		 function(accepted, caller) {
		 	return;
			})
}


webix.ready(function(){

	webix.ui({
		rows : [
			{ view:"toolbar", cols:[
				{ view:"label", label : "Cis 197 Video Chat Final Project" },
				{ view:"label", id:"status", css:"status", value:"No viewers", width: 200 },
				{ view:"button", id:"endcall", css: "endCall", value:"End Call", width: 100, click:function(){
					$$("endcall").hide();
					easyrtc.hangupAll();
					$$("onlineStreams").unselectAll()
				}, hidden:true }
			]},
			{ cols :[
				onlineStreams,
				videoChat
			]}
		]
	});

	var window = webix.ui ({
		view: "window", position:"top", head:false, modal:true,
		body: {
			view:"form", rows:[
				{ view:"text", name:"name", label:"Name: ", value:"" },
				{ view:"button", value:"Login", click: function () {
					var name = this.getFormView().getValues().name;
					if (!easyrtc.isNameValid (name))
						webix.message({ type:"error", text:"Invalid name" });
					else {
						this.getTopParentView().hide();
						listConfig.name = name;
						connect(listConfig);
					}
				}}
			]
		}
	});

	window.show();
	var input = window.getBody().elements.name.getInputNode();
	input.select(); 
	input.focus();
});