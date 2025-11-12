export const ProductTreeformat = (data, Name, Revision, ObjId, Root) => {
  
  const objectMap = new Map();

  data.forEach((object) => {
    if (objectMap.has(object[Name])) {
      objectMap.get(object[Name]).push(object);
    } else {
      objectMap.set(object[Name], [object]);
    }
  });

  const transformedData = [];

  objectMap.forEach((objs) => {
    
    
    if (objs.length >1) {
      let rootid = null;
      const children = objs.map((obj) => ({
        id: Math.random(),
        productid: obj[ObjId],
        label: `${obj[Name]}:${obj[Revision]}`,
        value: obj[Name],
        revsion: obj[Revision],
        className: "empty-icon",
        checked: false,
        IsRoR: obj.ActiveRevision,
      }));

      const rootProduct = objs.find((obj) => obj[Root] !== null) || objs[0];

      transformedData.push({
        id: Math.random(),
        productid: rootProduct[Root],
        label: rootProduct[Name],
        value: rootProduct[Name],
        revsion: "",
        checked: false,
        className: "empty-icon",
        expanded: false,
        IsRoR: true,
        children: children,
      });
    } else {
      // Single revision
      
      const obj = objs[0];

      transformedData.push({
        id: Math.random(),
        productid: obj[ObjId],
        label: obj[Name],
        value: obj[Name],
        revsion: "",
        checked: false,
        className: "empty-icon",
        expanded: false,
        IsRoR: true,
        children: [
          {
            id: Math.random(),
            productid: obj[ObjId],
            label: `${obj[Name]}:${obj[Revision]}`,
            value: obj[Name],
            revsion: obj[Revision],
            className: "empty-icon",
            checked: false,
            IsRoR: obj.ActiveRevision,
          },
        ],
      });
    }
  });

  return transformedData;
};
export const sampleformat = (data, Name, Revision, ObjId, Root) => {
  const templist = [];
  data.map((obj) => {
    const newobj = {
      id: Math.random(),
      productid: obj[ObjId],
      label: `${obj[Name]}:${obj[Revision]}`,
      value: obj[Revision],
      revsion: obj[Revision],
      className: "empty-icon",
      checked: false,
      IsRoR: obj.ActiveRevision,
    };
    templist.push(newobj);
  });
  return templist;
};
