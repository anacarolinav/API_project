import * as Yup from "yup";
import { handleIfMandatoryValidation } from "../../../../assets/functions/HandleRules/handleIfMandatoryValidation";
import { handleConditionValidation } from "../../../../assets/functions/HandleRules/handleConditionValidation";
import { handleRules } from "../../../../assets/functions/HandleRules/handleRules";
import { handleRequiredValidation } from "../../../../assets/functions/HandleSectionValidation/handleRequiredValidation";
import { handleRequiredSection } from "../../../../assets/functions/HandleSectionValidation/handleRequiredSection"; // ATENÇÃO: CADA NOVA VALIDAÇÃO DEVE VER SE O CAMPO É VISÍVEL!

const buildMultimediaValidation = (item, pathLabel, cardinalityObject, validationSchema, itemSection, sectionValidation, multipleSections, fileMaxSize) => {
  const checkMandatory = handleIfMandatoryValidation(item);

  if (item.occurrences.lowerOccurrences === 1 && item.occurrences.upperOccurrences === 1) {
    validationSchema[pathLabel] = Yup.array().test("required", "Campo obrigatório", function (value) {
      const isVisible = handleRules(item, this.parent, "visibility");

      if (!isVisible) {
        return true;
      }

      const passedRequired = handleRequiredValidation(value, this.parent, itemSection);

      if (passedRequired) {
        return true;
      } else {
        return false;
      }
    }).test("section-validation", function (value) {
      const isVisible = handleRules(item, this.parent, "visibility");

      if (!isVisible) {
        return true;
      }

      const res = handleRequiredSection(sectionValidation, pathLabel, this.parent, multipleSections);

      if (res === true) {
        return true;
      } else {
        const sectionsError = res;

        if (sectionsError.length > 1) {
          return this.createError({
            message: "Precisa de preencher mais campos nas secções: " + sectionsError.toString().toLocaleLowerCase()
          });
        } else if (sectionsError.length === 1) {
          return this.createError({
            message: "Precisa de preencher mais campos na secção " + sectionsError.toString().toLocaleLowerCase()
          });
        }
      }
    }).test("at-least-one", function (value) {
      const isVisible = handleRules(item, this.parent, "visibility");

      if (!isVisible) {
        return true;
      }

      const res = handleRequiredSection(cardinalityObject, pathLabel, this.parent, multipleSections);

      if (res === true) {
        return true;
      } else {
        const sectionsError = res;

        if (sectionsError.length > 1) {
          return this.createError({
            message: "Precisa de preencher mais campos nas secções: " + sectionsError.toString().toLocaleLowerCase()
          });
        } else if (sectionsError.length === 1) {
          return this.createError({
            message: "Precisa de preencher mais campos na secção " + sectionsError.toString().toLocaleLowerCase()
          });
        }
      }
    });
  } else if (item.occurrences.lowerOccurrences === 0 && item.occurrences.upperOccurrences === 1) {
    validationSchema[pathLabel] = Yup.array().of(Yup.object().test("maxFileSize", function (value) {
      if (Math.round(value.size * 0.0009765625) > parseInt(fileMaxSize)) {
        return this.createError({
          message: /*#__PURE__*/React.createElement("span", {
            key: value.size
          }, /*#__PURE__*/React.createElement("b", null, "Ficheiro Inv\xE1lido:"), " O tamanho do ficheiro ", value.name, " ultrapassa os ", fileMaxSize, " MB.", /*#__PURE__*/React.createElement("br", null))
        });
      } else {
        return true;
      }
    })).test("section-validation", function (value) {
      const isVisible = handleRules(item, this.parent, "visibility");

      if (!isVisible) {
        return true;
      }

      const res = handleRequiredSection(sectionValidation, pathLabel, this.parent, multipleSections);

      if (res === true) {
        return true;
      } else {
        const sectionsError = res;

        if (sectionsError.length > 1) {
          return this.createError({
            message: "Precisa de preencher mais campos nas secções: " + sectionsError.toString().toLocaleLowerCase()
          });
        } else if (sectionsError.length === 1) {
          return this.createError({
            message: "Precisa de preencher mais campos na secção " + sectionsError.toString().toLocaleLowerCase()
          });
        }
      }
    }).test("at-least-one", function (value) {
      const isVisible = handleRules(item, this.parent, "visibility");

      if (!isVisible) {
        return true;
      }

      const res = handleRequiredSection(cardinalityObject, pathLabel, this.parent, multipleSections);

      if (res === true) {
        return true;
      } else {
        const sectionsError = res;

        if (sectionsError.length > 1) {
          return this.createError({
            message: "Precisa de preencher mais campos nas secções: " + sectionsError.toString().toLocaleLowerCase()
          });
        } else if (sectionsError.length === 1) {
          return this.createError({
            message: "Precisa de preencher mais campos na secção " + sectionsError.toString().toLocaleLowerCase()
          });
        }
      }
    }).test("rule-mandatory", "Campo obrigatório", function (value) {
      const isVisible = handleRules(item, this.parent, "visibility");

      if (!isVisible) {
        return true;
      }

      if (!checkMandatory) {
        return true;
      } else {
        let i;

        for (i = 0; i < item.ruleMandatory.length; i++) {
          const rule = item.ruleMandatory[i];
          let mandatory;

          if (rule["$or"]) {
            mandatory = false;
            let j;
            const conditionsArray = rule["$or"];

            for (j = 0; j < conditionsArray.length; j++) {
              const condition = conditionsArray[j];
              const path = condition["$ItemPath"].split(".").join("-");
              const conditionValidation = handleConditionValidation(condition, this.parent[path]);

              if (conditionValidation) {
                mandatory = true;
                break;
              }
            }
          } else if (rule["$and"]) {
            mandatory = true;
            let j;
            const conditionsArray = rule["$and"];

            for (j = 0; j < conditionsArray.length; j++) {
              const condition = conditionsArray[j];
              const path = condition["$ItemPath"].split(".").join("-");
              const conditionValidation = handleConditionValidation(condition, this.parent[path]);

              if (!conditionValidation) {
                mandatory = false;
                break;
              }
            }
          }

          if (!mandatory) {
            return true;
          } else {
            if (value === "" || value === undefined) {
              return false;
            } else if (Array.isArray(value)) {
              if (value.length === 0) {
                return false;
              } else if (value[0].identifierId !== undefined && value.filter(obj => obj.value !== "").length === 0) {
                return false;
              } else if (value[0].textId !== undefined && value.filter(obj => obj.value.getCurrentContent().hasText()).length === 0) {
                return false;
              } else {
                return true;
              }
            } else if (value._immutable !== undefined) {
              if (!value.getCurrentContent().hasText()) {
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
          }
        }
      }
    });
  }
};

export { buildMultimediaValidation };