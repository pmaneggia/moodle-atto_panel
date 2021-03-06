YUI.add('moodle-atto_panel-button', function (Y, NAME) {

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
 * @package    atto_panel
 * @copyright  Richard Jones {@link http://richardnz.net/}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_panel-button
 */

/**
 * Atto text editor panel plugin.
 *
 * @namespace M.atto_panel
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_panel';
var TEXTLINKCONTROL = 'panel_link';
var panelIDCONTROL = 'panel_number';
var DISPLAYMODECONTROL = 'display_mode';
var LOGNAME = 'atto_panel';

var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel',
        TEXTLINKCONTROL: 'textlinkcontrol',
        panelIDCONTROL: 'panelidcontrol',
        DISPLAYMODECONTROL: 'displaymodecontrol'
    },
    SELECTORS = {
        TEXTLINKCONTROL: '.textlinkcontrol',
        panelIDCONTROL: '.panelidcontrol',
        DISPLAYMODECONTROL: '.displaymodecontrol'
    };

var TEMPLATE = '' +
    '<form class="atto_form">' +
        '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
            '<label for="{{elementid}}_{{TEXTLINKCONTROL}}">' +
            '{{get_string "enterlinktext" component}}</label>' +
            '<input class="{{CSS.TEXTLINKCONTROL}}" id="{{elementid}}_{{TEXTLINKCONTROL}}"' +
            ' name="{{elementid}}_{{TEXTLINKCONTROL}}" value="{{defaulttextlink}}" />' +
            '<label for="{{elementid}}_{{panelIDCONTROL}}">' +
            '{{get_string "enterpanelid" component}}</label>' +
            '<input class="{{CSS.panelIDCONTROL}}" id="{{elementid}}_{{panelIDCONTROL}}"' +
            ' name="{{elementid}}_{{panelIDCONTROL}}" value="{{defaultpanelid}}" />' +
            '<br /><br />' +
            '<input type="checkbox" class="{{CSS.DISPLAYMODECONTROL}}" id="{{elementid}}_{{DISPLAYMODECONTROL}}"' +
            '<label for="{{elementid}}_{{DISPLAYMODECONTROL}}">' +
            '{{get_string "enterdisplaymode" component}}</label>' +
            '<br /><br />' +
            '<button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button>' +
        '</div>' +
    '</form>';

Y.namespace('M.atto_panel').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function() {
        // If we don't have the capability to view then give up.
        if (this.get('disabled')){
            return;
        }

        this.addButton({
            icon:'icon',
            iconComponent: 'atto_panel',
            callback: this._displayDialogue
        });
    },


    /**
     * Get the id of the text link control where we store the link text for the panel
     *
     * @method _getTextLinkControlName
     * @return {String} the txt for the text link form field
     * @private
     */
    _getTextLinkControlName: function(){
        return(this.get('host').get('elementid') + '_' + TEXTLINKCONTROL);
    },

     /**
     * Display the panel Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e) {
        e.preventDefault();
        var width=400;


        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: true
        });
        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if(dialogue.width !== width + 'px'){
            dialogue.set('width',width+'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent();

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
    _getFormContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                TEXTLINKCONTROL: TEXTLINKCONTROL,
                component: COMPONENTNAME,
                defaultflavor: this.get('defaulttextlink'),
                panelIDCONTROL: panelIDCONTROL,
                component: COMPONENTNAME,
                defaultflavor: this.get('defaultpanelid'),
                //clickedicon: icon
            }));

        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

    /**
     * Inserts the users input onto the page - or an error message
     * @method _getDialogueContent
     * @private
     */
    _doInsert : function(e){
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var error_message ='';
        var error_found = false;

        // deal with the link text
        var linkcontrol = this._form.one(SELECTORS.TEXTLINKCONTROL);
        var linkvalue = linkcontrol.get('value');

        // Check is there
        if (!linkvalue) {
            Y.log('No link text could be found.', 'warn', LOGNAME);
            error_message - 'No link text could be found.';
            error_found = true;
            //return;
        }

        // get the panel number
        var idcontrol = this._form.one(SELECTORS.panelIDCONTROL);
        var idvalue = idcontrol.get('value');

        // Check is there
        if (!idvalue) {
            Y.log('No panel id could be found.', 'warn', LOGNAME);
            error_message = 'No panel id could be found.';
            error_found = true;
            //return;
        }


        //  Check is an integer - use this for the panel ID
        var isnum = /^\d+$/.test(idvalue);
        if (!isnum) {
            Y.log('Requires an integer value', 'warn', LOGNAME);
            error_message = 'panel id requires an integer value.';
            error_found = true;
           // return;
        }

        // deal with the display mode
        var displaycontrol = this._form.one(SELECTORS.DISPLAYMODECONTROL);
        var displayvalue = displaycontrol.get('checked');
        if (displayvalue) {
            displaytext = 'popup';
        } else {
            displaytext = 'embed';
        }

        // build content here: {panel} tags and text - or error
        if (!error_found) {

            content = this.get('starttag') + linkvalue + '|' + idvalue + '|' + displaytext +
                      this.get('endtag');
        } else {
            content = '{panel:' + error_message + '}';
        }

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(content);
        this.markUpdated();

    }
}, { ATTRS: {
        disabled: {
            value: false
        },

        usercontextid: {
            value: null
        },

        starttag: {
        value: ''
        },
        endtag: {
        value: ''
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
