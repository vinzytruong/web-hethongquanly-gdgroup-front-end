import * as yup from 'yup';

export interface UtilizedObject
 {
    utilizedObjectId: number,
    utilizedObjectName: string,
}
export const utilizedObjects: UtilizedObject[] = [
    { utilizedObjectId: 1, utilizedObjectName: 'HS' },
    { utilizedObjectId: 2, utilizedObjectName: 'GV' },
    { utilizedObjectId: 3, utilizedObjectName: 'GV và HS' },
];
