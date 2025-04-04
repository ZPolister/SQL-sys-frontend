/* tslint:disable */
/* eslint-disable */
/**
 * TTXX健康
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface MedicationReminder
 */
export interface MedicationReminder {
    /**
     * 
     * @type {number}
     * @memberof MedicationReminder
     */
    reminderId?: number;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminder
     */
    accountId?: number;
    /**
     * 
     * @type {string}
     * @memberof MedicationReminder
     */
    medicationName?: string;
    /**
     * 
     * @type {string}
     * @memberof MedicationReminder
     */
    medicationDosage?: string;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminder
     */
    medicationFrequency?: number;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminder
     */
    medicationDuration?: number;
    /**
     * 
     * @type {Date}
     * @memberof MedicationReminder
     */
    startTime?: Date;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminder
     */
    completionStatus?: number;
    /**
     * 
     * @type {Date}
     * @memberof MedicationReminder
     */
    nextReminderTime?: Date;
    /**
     * 
     * @type {string}
     * @memberof MedicationReminder
     */
    reminderTime?: string;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminder
     */
    reminderCount?: number;
    /**
     * 
     * @type {Date}
     * @memberof MedicationReminder
     */
    createdAt?: Date;
}

/**
 * Check if a given object implements the MedicationReminder interface.
 */
export function instanceOfMedicationReminder(value: object): value is MedicationReminder {
    return true;
}

export function MedicationReminderFromJSON(json: any): MedicationReminder {
    return MedicationReminderFromJSONTyped(json, false);
}

export function MedicationReminderFromJSONTyped(json: any, ignoreDiscriminator: boolean): MedicationReminder {
    if (json == null) {
        return json;
    }
    return {
        
        'reminderId': json['reminderId'] == null ? undefined : json['reminderId'],
        'accountId': json['accountId'] == null ? undefined : json['accountId'],
        'medicationName': json['medicationName'] == null ? undefined : json['medicationName'],
        'medicationDosage': json['medicationDosage'] == null ? undefined : json['medicationDosage'],
        'medicationFrequency': json['medicationFrequency'] == null ? undefined : json['medicationFrequency'],
        'medicationDuration': json['medicationDuration'] == null ? undefined : json['medicationDuration'],
        'startTime': json['startTime'] == null ? undefined : (new Date(json['startTime'])),
        'completionStatus': json['completionStatus'] == null ? undefined : json['completionStatus'],
        'nextReminderTime': json['nextReminderTime'] == null ? undefined : (new Date(json['nextReminderTime'])),
        'reminderTime': json['reminderTime'] == null ? undefined : json['reminderTime'],
        'reminderCount': json['reminderCount'] == null ? undefined : json['reminderCount'],
        'createdAt': json['createdAt'] == null ? undefined : (new Date(json['createdAt'])),
    };
}

export function MedicationReminderToJSON(json: any): MedicationReminder {
    return MedicationReminderToJSONTyped(json, false);
}

export function MedicationReminderToJSONTyped(value?: MedicationReminder | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'reminderId': value['reminderId'],
        'accountId': value['accountId'],
        'medicationName': value['medicationName'],
        'medicationDosage': value['medicationDosage'],
        'medicationFrequency': value['medicationFrequency'],
        'medicationDuration': value['medicationDuration'],
        'startTime': value['startTime'] == null ? undefined : ((value['startTime']).toISOString()),
        'completionStatus': value['completionStatus'],
        'nextReminderTime': value['nextReminderTime'] == null ? undefined : ((value['nextReminderTime']).toISOString()),
        'reminderTime': value['reminderTime'],
        'reminderCount': value['reminderCount'],
        'createdAt': value['createdAt'] == null ? undefined : ((value['createdAt']).toISOString()),
    };
}

