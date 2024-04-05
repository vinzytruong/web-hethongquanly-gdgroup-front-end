
const getUnique = (data: any) => {
    const seenIDs = new Set<any>();

    const filteredArrayUnique = data?.filter((item: any) => {
        if (!seenIDs.has(item.personID)) {
            seenIDs.add(item.personID);
            return true;
        }
        return false;
    });
    return filteredArrayUnique
};
export { getUnique };
