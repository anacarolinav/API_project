const buildMultimediaInitialValue = (item, pathLabel, initialValues) => {
  let value = item.value === null ? [] : item.value;
  initialValues[pathLabel] = value;
};

export { buildMultimediaInitialValue };