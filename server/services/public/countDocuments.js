export const countDocuments = async(schemaName, options = {}) => {
    return await schemaName.countDocuments(options)
}