export interface CheckingStateProps {
    dataChecking?: GetChecking[];
    error?: object | string | null;
}

export interface GetChecking {
    personName?: string;
    date?: string;
    checkinTime?: number;
    aliasID?: string;
    placeID?: string;
    personID?: string;
    avatar?: string;
    place?: string;
    title?: string;
    type?: number;
    deviceID?: string;
    deviceName?: string;
};
export interface RootStateProps {
    getChecking: CheckingStateProps;
}