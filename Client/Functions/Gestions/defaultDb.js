const { Schema } = require("mongoose");

/**
 * 
 * @param {Schema} schema 
 * @returns {Object}
 */
module.exports = schema => {

    const defaults = {};

    const traverse = (paths, parentPath) => {
        Object.keys(paths).forEach((key) => {
            const path = paths[key];
            const fullPath = parentPath ? `${parentPath}.${key}` : key;

            if (path.defaultValue !== undefined) {
                const keys = fullPath.split('.');
                keys.reduce((acc, key, index) => {
                    if (index === keys.length - 1) {
                        acc[key] = path.defaultValue;
                    } else {
                        acc[key] = acc[key] || {};
                    }
                    return acc[key];
                }, defaults);
            }

            if (path.schema) {
                traverse(path.schema.paths, fullPath);
            } else if (path.caster && path.caster.instance === 'Embedded') {
                traverse(path.caster.schema.paths, fullPath);
            }
        });
    };

    traverse(schema.paths, '');

    return defaults;
};