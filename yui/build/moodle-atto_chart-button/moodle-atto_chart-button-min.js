YUI.add("moodle-atto_chart-button",function(e,t){var n="atto_chart",r="chart_flavor",i={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",FLAVORCONTROL:"flavorcontrol"},s='<form class="atto_form"><div id="{{elementid}}_{{innerform}}" class="mdl-left"><label for="{{elementid}}_{{FLAVORCONTROL}}">{{get_string "charttype" component}}</label><input type="radio" name="type" value="scatter" checked>Scatter&nbsp;&nbsp;&nbsp;<input type="radio" name="type" value="line">Line&nbsp;&nbsp;&nbsp;<input type="radio" name="type" value="spline">Spline<br><input type="radio" name="type" value="bar">Bar&nbsp;&nbsp;&nbsp;<input type="radio" name="type" value="barH">Horz. Bar<br><input type="radio" name="type" value="pie">Pie&nbsp;&nbsp;&nbsp;<input type="radio" name="type" value="pie3D">Pie 3D&nbsp;&nbsp;&nbsp;<input type="radio" name="type" value="donut">Donut<br/><hr><label for="charttitle">Chart Title</label><input type="text" name="charttitle" id="charttitle" value=""><br/><label for="xaxistitle">x-axis title</label><input type="text" name="xaxistitle" id="xaxistitle" value=""><br/><label for="yaxistitle">y-axis title</label><input type="text" name="yaxistitle" id="yaxistitle" value=""><hr><button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button></div></form>',o='<iframe src="http://desktop/moodle28/lib/editor/atto/plugins/chart/view.php?chartid={{chartid}}"width="760" height="690" scrolling="no" frameBorder="0" ></iframe>';e.namespace("M.atto_chart").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{initializer:function(){if(this.get("disabled"))return;this.addButton({icon:"chart",iconComponent:"atto_chart",buttonName:"chart",callback:this._displayDialogue,callbackArgs:"chart"}),this.editor.delegate("dblclick",this._displayChart,".eo_chart",this)},_getFlavorControlName:function(){return this.get("host").get("elementid")+"_"+r},_displayChart:function(t){var r=t.target,i=r.get("className"),s=i.split(" ");this._currentSelection=this.get("host").getSelection();if(this._currentSelection===!1)return;var o=this.getDialogue({width:"auto",focusAfterHide:!0});o.setStdModContent(e.WidgetStdMod.HEADER,M.util.get_string("viewchart",n)),o.set("bodyContent",this._getChartContent(s[1])).show()},_getChartContent:function(t){var r=e.Handlebars.compile(o),s=e.Node.create(r({elementid:this.get("host").get("elementid"),CSS:i,chartid:t,component:n}));return this._form=s,s},_displayDialogue:function(t,r,i){t.preventDefault();var s=300,o=this.getDialogue({headerContent:M.util.get_string("dialogtitle",n),width:s+"px",focusAfterHide:r});o.width!==s+"px"&&o.set("width",s+"px");var u=this._getFormContent(r,i),a=e.Node.create("<div></div>");a.append(u),o.set("bodyContent",a),o.show(),this.markUpdated()},_getFormContent:function(t){var o=e.Handlebars.compile(s),u=e.Node.create(o({elementid:this.get("host").get("elementid"),CSS:i,FLAVORCONTROL:r,component:n,defaultflavor:this.get("defaultflavor"),clickedicon:t}));return this._form=u,this._form.one("."+i.INPUTSUBMIT).on("click",this._doInsert,this),u},_doInsert:function(t){t.preventDefault(),this.getDialogue({focusAfterHide:null}).hide();var n=e.one("#charttitle").get("value"),r=e.one("#xaxistitle").get("value"),i=e.one("#yaxistitle").get("value"),s=e.one("input[name=type]:checked").get("value"),o=new XMLHttpRequest,u=this;o.onreadystatechange=function(){return function(){if(o.readyState===4){var e=o.responseText;u.editor.focus(),sheet='<br><div class="eo_chart '+e+'"></div><br>',u.get("host").insertContentAtFocusPoint(sheet),u.markUpdated();if(o.status===200){var t=o.responseText,n=t.indexOf("success<error>");if(n<1)return}}}}(this);var a="type="+s;a+="&title="+n,a+="&xaxistitle="+r,a+="&yaxistitle="+i,o.open("POST",M.cfg.wwwroot+"/lib/editor/atto/plugins/chart/dblib.php",!0),o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),o.setRequestHeader("Cache-Control","no-cache"),o.setRequestHeader("Content-length",a.length),o.setRequestHeader("Connection","close"),o.send(a)}},{ATTRS:{disabled:{value:!1},userid:{value:""},usercontextid:{value:null},defaultflavor:{value:""}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin","datatype-date"]});
