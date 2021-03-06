import isFunction from 'lodash.isfunction';
import warning from './warning';
import actionTypes from '../actionTypes';

const { SET_STATE } = actionTypes;

/**
 * convertEffects
 *
 * Compatible with 1.1.0 ~ 1.2.0
 * effects: {} => effects: () => ({})
 * @param originModels
 */
export function convertEffects(originModels: any) {
  const models = {};
  Object.keys(originModels).forEach(function(name) {
    const model = originModels[name];
    const originEffects = model.effects;
    if (originEffects && !isFunction(originEffects)) {
      warning(`Model(${name}): Defining effects as objects has been detected, please use \`{ effects: () => ({ effectName: () => {} }) }\` instead. \n\n\n Visit https://github.com/ice-lab/icestore/blob/master/docs/upgrade-guidelines.md#define-model-effects to learn about how to upgrade.`);
      model.effects = (dispatch: any) => {
        const effects = {};
        Object.keys(originEffects).forEach(function(key) {
          const originEffect = originEffects[key];
          effects[key] = (payload: any, rootState: any) => originEffect(
            rootState[name],
            payload,
            dispatch[name],
            dispatch,
          );
        });
        return effects;
      };
    }
    models[name] = model;
  });
  return models;
}

/**
 * convertActions
 *
 * Compatible with 1.0.0 ~ 1.1.0
 * actions: {} => effects: () => ({})
 * @param originModels
 */
export function convertActions(originModels: any) {
  const models = {};
  Object.keys(originModels).forEach(function(name) {
    const model = originModels[name];
    const actions = model.actions;
    if (actions) {
      warning(`Model(${name}): The actions field has been detected, please use \`reducers\` and \`effects\` instead. Visit https://github.com/ice-lab/icestore/blob/master/docs/upgrade-guidelines.md#define-model-actions to learn about how to upgrade.`);
      if (!model.reducers) {
        model.reducers = {};
      }
      model.effects = function(dispatch: any) {
        const effects = {};
        Object.keys(actions).forEach(function(key) {
          const originAction = actions[key];
          effects[key] = async function(payload: any, rootState: any) {
            const result = await originAction(
              rootState[name],
              payload,
              dispatch[name],
              dispatch,
            );
            if (dispatch[name][SET_STATE]) {
              dispatch[name][SET_STATE](result);
            }
          };
        });
        return effects;
      };
    }
    models[name] = model;
  });
  return models;
}
