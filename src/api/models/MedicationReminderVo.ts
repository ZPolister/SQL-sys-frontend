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
 * 响应数据
 * @export
 * @interface MedicationReminderVo
 */
export interface MedicationReminderVo {
    /**
     * 
     * @type {string}
     * @memberof MedicationReminderVo
     */
    medicationName?: string;
    /**
     * 
     * @type {string}
     * @memberof MedicationReminderVo
     */
    medicationDosage?: string;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminderVo
     */
    medicationFrequency?: number;
    /**
     * 
     * @type {number}
     * @memberof MedicationReminderVo
     */
    medicationDuration?: number;
}

/**
 * Check if a given object implements the MedicationReminderVo interface.
 */
export function instanceOfMedicationReminderVo(value: object): value is MedicationReminderVo {
    return true;
}

export function MedicationReminderVoFromJSON(json: any): MedicationReminderVo {
    return MedicationReminderVoFromJSONTyped(json, false);
}

export function MedicationReminderVoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MedicationReminderVo {
    if (json == null) {
        return json;
    }
    return {
        
        'medicationName': json['medicationName'] == null ? undefined : json['medicationName'],
        'medicationDosage': json['medicationDosage'] == null ? undefined : json['medicationDosage'],
        'medicationFrequency': json['medicationFrequency'] == null ? undefined : json['medicationFrequency'],
        'medicationDuration': json['medicationDuration'] == null ? undefined : json['medicationDuration'],
    };
}

export function MedicationReminderVoToJSON(json: any): MedicationReminderVo {
    return MedicationReminderVoToJSONTyped(json, false);
}

export function MedicationReminderVoToJSONTyped(value?: MedicationReminderVo | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'medicationName': value['medicationName'],
        'medicationDosage': value['medicationDosage'],
        'medicationFrequency': value['medicationFrequency'],
        'medicationDuration': value['medicationDuration'],
    };
}

