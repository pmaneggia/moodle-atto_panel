YUI.add("moodle-atto_question-button",function(e,t){var n="atto_question",r="question_flavor",i="atto_question",s={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",FLAVORCONTROL:"flavorcontrol"},o={FLAVORCONTROL:".flavorcontrol"},u='<form class="atto_form"><div id="{{elementid}}_{{innerform}}" class="mdl-align"><label for="{{elementid}}_{{FLAVORCONTROL}}">{{get_string "enterflavor" component}}</label><input class="{{CSS.FLAVORCONTROL}}" id="{{elementid}}_{{FLAVORCONTROL}}" name="{{elementid}}_{{FLAVORCONTROL}}" value="{{defaultflavor}}" /><button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button></div>icon: {{clickedicon}}</form>';e.namespace("M.atto_question").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{initializer:function(){if(this.get("disabled"))return;var t=["iconone"];e.Array.each(t,function(e){this.addButton({icon:"ed/"+t,iconComponent:"atto_question",buttonName:e,callback:this._displayDialogue,callbackArgs:e})},this)},_getFlavorControlName:function(){return this.get("host").get("elementid")+"_"+r},_displayDialogue:function(t,r){t.preventDefault();var i=400,s=this.getDialogue({headerContent:M.util.get_string("dialogtitle",n),width:i+"px",focusAfterHide:r});s.width!==i+"px"&&s.set("width",i+"px");var o=this._getFormContent(r),u=e.Node.create("<div></div>");u.append(o),s.set("bodyContent",u),s.show(),this.markUpdated()},_getFormContent:function(t){var i=e.Handlebars.compile(u),o=e.Node.create(i({elementid:this.get("host").get("elementid"),CSS:s,FLAVORCONTROL:r,component:n,defaultflavor:this.get("defaultflavor"),clickedicon:t}));return this._form=o,this._form.one("."+s.INPUTSUBMIT).on("click",this._doInsert,this),o},_doInsert:function(e){e.preventDefault(),this.getDialogue({focusAfterHide:null}).hide();var t=this._form.one(o.FLAVORCONTROL);if(!t.get("value"))return;this.editor.focus(),this.get("host").insertContentAtFocusPoint(t.get("value")),this.markUpdated()}},{ATTRS:{disabled:{value:!1},usercontextid:{value:null},defaultflavor:{value:""}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
