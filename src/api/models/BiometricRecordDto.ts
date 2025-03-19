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
 * @interface BiometricRecordDto
 */
export interface BiometricRecordDto {
    /**
     * 身高(cm)
     * @type {number}
     * @memberof BiometricRecordDto
     */
    heightCm?: number;
    /**
     * 体重(kg)
     * @type {number}
     * @memberof BiometricRecordDto
     */
    weightKg?: number;
    /**
     * 收缩压(mmHg)
     * @type {number}
     * @memberof BiometricRecordDto
     */
    systolicPressure?: number;
    /**
     * 舒张压(mmHg)
     * @type {number}
     * @memberof BiometricRecordDto
     */
    diastolicPressure?: number;
    /**
     * 血糖(mmol/L)
     * @type {number}
     * @memberof BiometricRecordDto
     */
    bloodGlucose?: number;
    /**
     * 血脂(mmol/L)
     * @type {number}
     * @memberof BiometricRecordDto
     */
    bloodLipid?: number;
    /**
     * 测量时间
     * @type {Date}
     * @memberof BiometricRecordDto
     */
    measurementTime?: Date;
}

/**
 * Check if a given object implements the BiometricRecordDto interface.
 */
export function instanceOfBiometricRecordDto(value: object): value is BiometricRecordDto {
    return true;
}

export function BiometricRecordDtoFromJSON(json: any): BiometricRecordDto {
    return BiometricRecordDtoFromJSONTyped(json, false);
}

export function BiometricRecordDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): BiometricRecordDto {
    if (json == null) {
        return json;
    }
    return {
        
        'heightCm': json['heightCm'] == null ? undefined : json['heightCm'],
        'weightKg': json['weightKg'] == null ? undefined : json['weightKg'],
        'systolicPressure': json['systolicPressure'] == null ? undefined : json['systolicPressure'],
        'diastolicPressure': json['diastolicPressure'] == null ? undefined : json['diastolicPressure'],
        'bloodGlucose': json['bloodGlucose'] == null ? undefined : json['bloodGlucose'],
        'bloodLipid': json['bloodLipid'] == null ? undefined : json['bloodLipid'],
        'measurementTime': json['measurementTime'] == null ? undefined : (new Date(json['measurementTime'])),
    };
}

export function BiometricRecordDtoToJSON(json: any): BiometricRecordDto {
    return BiometricRecordDtoToJSONTyped(json, false);
}

export function BiometricRecordDtoToJSONTyped(value?: BiometricRecordDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'heightCm': value['heightCm'],
        'weightKg': value['weightKg'],
        'systolicPressure': value['systolicPressure'],
        'diastolicPressure': value['diastolicPressure'],
        'bloodGlucose': value['bloodGlucose'],
        'bloodLipid': value['bloodLipid'],
        'measurementTime': value['measurementTime'] == null ? undefined : ((value['measurementTime']).toISOString()),
    };
}

