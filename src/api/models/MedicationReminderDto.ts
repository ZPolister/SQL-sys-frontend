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
 * 服药提醒数据传输对象
 * @export
 * @interface MedicationReminderDto
 */
export interface MedicationReminderDto {
    /**
     * 药品名称
     * @type {string}
     * @memberof MedicationReminderDto
     */
    medicationName: string;
    /**
     * 药品剂量
     * @type {string}
     * @memberof MedicationReminderDto
     */
    medicationDosage: string;
    /**
     * 每日服药次数
     * @type {number}
     * @memberof MedicationReminderDto
     */
    medicationFrequency: number;
    /**
     * 服药持续天数
     * @type {number}
     * @memberof MedicationReminderDto
     */
    medicationDuration: number;
    /**
     * 提醒内容
     * @type {string}
     * @memberof MedicationReminderDto
     */
    reminderContent?: string;
    /**
     * 提醒时间（格式：[HH:mm]）
     * @type {string}
     * @memberof MedicationReminderDto
     */
    reminderTime: string;
    /**
     * 开始服药时间
     * @type {Date}
     * @memberof MedicationReminderDto
     */
    startTime: Date;
}

/**
 * Check if a given object implements the MedicationReminderDto interface.
 */
export function instanceOfMedicationReminderDto(value: object): value is MedicationReminderDto {
    if (!('medicationName' in value) || value['medicationName'] === undefined) return false;
    if (!('medicationDosage' in value) || value['medicationDosage'] === undefined) return false;
    if (!('medicationFrequency' in value) || value['medicationFrequency'] === undefined) return false;
    if (!('medicationDuration' in value) || value['medicationDuration'] === undefined) return false;
    if (!('reminderTime' in value) || value['reminderTime'] === undefined) return false;
    if (!('startTime' in value) || value['startTime'] === undefined) return false;
    return true;
}

export function MedicationReminderDtoFromJSON(json: any): MedicationReminderDto {
    return MedicationReminderDtoFromJSONTyped(json, false);
}

export function MedicationReminderDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MedicationReminderDto {
    if (json == null) {
        return json;
    }
    return {
        
        'medicationName': json['medicationName'],
        'medicationDosage': json['medicationDosage'],
        'medicationFrequency': json['medicationFrequency'],
        'medicationDuration': json['medicationDuration'],
        'reminderContent': json['reminderContent'] == null ? undefined : json['reminderContent'],
        'reminderTime': json['reminderTime'],
        'startTime': (new Date(json['startTime'])),
    };
}

export function MedicationReminderDtoToJSON(json: any): MedicationReminderDto {
    return MedicationReminderDtoToJSONTyped(json, false);
}

export function MedicationReminderDtoToJSONTyped(value?: MedicationReminderDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'medicationName': value['medicationName'],
        'medicationDosage': value['medicationDosage'],
        'medicationFrequency': value['medicationFrequency'],
        'medicationDuration': value['medicationDuration'],
        'reminderContent': value['reminderContent'],
        'reminderTime': value['reminderTime'],
        'startTime': ((value['startTime']).toISOString()),
    };
}

