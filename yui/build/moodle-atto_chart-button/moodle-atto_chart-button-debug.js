YUI.add('moodle-atto_chart-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_chart
 * @copyright  COPYRIGHTINFO
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_chart-button
 */

/**
 * Atto text editor chart plugin.
 *
 * @namespace M.atto_chart
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_chart';
var FLAVORCONTROL = 'chart_flavor';
var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel',
        FLAVORCONTROL: 'flavorcontrol'
    };

var TEMPLATE = '' +
    '<form class="atto_form">' +
        '<div id="{{elementid}}_{{innerform}}" class="mdl-left">' +
            '<label for="{{elementid}}_{{FLAVORCONTROL}}">{{get_string "enterflavor" component}}</label>' +
            '<input type="radio" name="type" value="scatter" checked>Scatter' +
            '<input type="radio" name="type" value="bar">Bar' +
            '<input type="radio" name="type" value="pie">Pie<br/><hr>' +
            '<label for="charttitle">Chart Title</label>' +
            '<input type="text" name="charttitle" id="charttitle" value=""><br/>' +
            '<label for="xaxistitle">x-axis title</label>' +
            '<input type="text" name="xaxistitle" id="xaxistitle" value=""><br/>' +
            '<label for="yaxistitle">y-axis title</label>' +
            '<input type="text" name="yaxistitle" id="yaxistitle" value=""><br/><hr>' +
            '<label for="readonly">Edit Permissions</label>' +
            '<input type="checkbox" name="readonly" id="readonly" value="readonly" checked> Read-only<br/>' +
            '<input type="checkbox" name="groupaccess" id="groupaccess" value="groupaccess"> Group access<br/><br/>' +
            '<button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button>' +
        '</div>' +
    '</form>';

Y.namespace('M.atto_chart').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

  
    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function() {
        // If we don't have the capability to view then give up.
        //alert(this.get('userid'));
        if (this.get('disabled')){
            return;
        }
            // Add the chart icon/buttons
            this.addButton({
                icon: 'chart',
                iconComponent: 'atto_chart',
                buttonName: 'chart',
                callback: this._displayDialogue,
                callbackArgs: 'chart'
            });
        

    },

    /**
     * Get the id of the flavor control where we store the ice cream flavor
     *
     * @method _getFlavorControlName
     * @return {String} the name/id of the flavor form field
     * @private
     */
    _getFlavorControlName: function(){
        return(this.get('host').get('elementid') + '_' + FLAVORCONTROL);
    },

     /**
     * Display the chart Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e, clickedicon, date1) {
        e.preventDefault();
        var width=300;


        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: clickedicon
        });
        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if(dialogue.width !== width + 'px'){
            dialogue.set('width',width+'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent(clickedicon, date1);

        var bodycontent =  Y.Node.create('<div></div>');
        bodycontent.append(buttonform);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();
        this.markUpdated();
    },


     /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function(clickedicon) {
        //var date1 = ''
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                FLAVORCONTROL: FLAVORCONTROL,
                component: COMPONENTNAME,
                defaultflavor: this.get('defaultflavor'),
                clickedicon: clickedicon
            }));
        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */
    _doInsert : function(e){
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var uid = this.get('userid');
        var charttitle = Y.one("#charttitle").get("value");
        var xaxistitle = Y.one("#xaxistitle").get("value");
        var yaxistitle = Y.one("#yaxistitle").get("value");

        var readonly = Y.one("#readonly").get("checked");
        //var type = Y.one("#type").get("checked");
        var type = Y.one("input[name=type]:checked").get("value");
        var typeattrib = 'type="'+type+'"';
        var groupattrib = 'group="false"';
        var groupaccess = Y.one("#groupaccess").get("checked");
        var groupmode = 0;
        if(groupaccess === true){groupattrib = 'group="true"'; groupmode = 1;}
        var readattrib = 'readonly="true"';
        if(readonly === false){readattrib = 'readonly="false"';}
           
        //write key to db
            var xhr = new XMLHttpRequest();
            //var ext = "png";
            // file received/failed
            var obj = this;
            xhr.onreadystatechange = (function() {
                return function() {
                    if (xhr.readyState === 4) {
                        var chartid = xhr.responseText;
                        obj.editor.focus();
                        sheet = '<br><div class="eo_chart" chart="'+chartid+'" ' + typeattrib + ' ' + groupattrib + ' '+readattrib+' uid="'+uid+'"></div><br>';
                        console.log(sheet);
                        obj.get('host').insertContentAtFocusPoint(sheet);
                        obj.markUpdated();
                        if (xhr.status === 200) {
                            var resp = xhr.responseText;
                            var start = resp.indexOf(
                                "success<error>");
                            if (start < 1) {
                                return;
                            }
                        }
                    }
                };
            })(this);

            var params = "?groupmode="+groupmode;
            params += "&readonly="+readonly;
            params += "&type="+type;
            params += "&title="+charttitle;
            params += "&xaxistitle="+xaxistitle;
            params += "&yaxistitle="+yaxistitle;
            xhr.open("POST", M.cfg.wwwroot +
                "/lib/editor/atto/plugins/chart/dblib.php",
                true);
            xhr.setRequestHeader("Content-Type",
                "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Content-length", params.length);
            xhr.setRequestHeader("Connection", "close");
            xhr.send(params);
            
    
    }
}, { ATTRS: {
        disabled: {
            value: false
        },

        userid: {
            value: ''
        },

        usercontextid: {
            value: null
        },

        defaultflavor: {
            value: ''
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin", "datatype-date"]});
