<?php
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

/**
 * structure settings.
 *
 * @package   atto_structure
 * @copyright  2014 onwards Carl LeBlond
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define('AJAX_SCRIPT', true);

if (!isset($CFG)) {
    require_once("../../../../../config.php");
}
global $CFG, $DB, $USER;
require_once($CFG->libdir . '/filelib.php');

$type  = optional_param('type', 0, PARAM_ALPHA);
$title  = optional_param('title', 0, PARAM_TEXT);
$xaxistitle = optional_param('xaxistitle', 0, PARAM_TEXT);
$yaxistitle = optional_param('yaxistitle', 0, PARAM_TEXT);

$readonlymode  = optional_param('readonly', 'true', PARAM_TEXT);

//$id = time();

$record = new stdClass();
//$record->id = $id;
$record->userid = $USER->id;
$record->type = $type;
$record->title = $title;
$record->xaxistitle = $xaxistitle;
$record->yaxistitle = $yaxistitle;


/*
if($readonlymode === 'true'){
$record->accesskey = (string)rand();
}
$record->groupmode = $groupmode;
*/
//Add to chart table
$id = $DB->insert_record('filter_chart', $record, true);

//add some blank data records
$data = new stdClass();
$data->chartid = $id;
$data->x1 = '';
$data->x2 = '';
$data->x3 = '';
$data->x4 = '';
$data->x5 = '';
$data->y1 = '';
$data->y2 = '';
$data->y3 = '';
$data->y4 = '';
$data->y5 = '';





$DB->insert_record('filter_chart_data', $data, false);

echo $id;
