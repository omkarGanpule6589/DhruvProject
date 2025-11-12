import React, { useEffect } from "react";

export const Dropdowntreecommononchangenode = (localNodes, item1, item2) => {
  if (item2.length === 0) {
    return localNodes.map((node) => {
      node.expanded = false;
      node.checked = false;
      node.className = `empty-icon`;

      if (node.children) {
        node.children = node.children.map((child) => {
          if (child.IsRoR === true) {
            child.checked = false;
            child.className = `done-icon`;
          } else {
            child.checked = false;
            child.className = `empty-icon`;
          }
          return child;
        });
      }
      return node;
    });
  } else {
    return localNodes.map((node) => {
      node.expanded = false;
      if (node.id === item1.id) {
        node.checked = true;
        node.className = `empty-icon nodeselected`;
      } else {
        node.checked = false;
        node.className = `empty-icon`;
      }

      if (node.children) {
        node.children = node.children.map((child) => {
          if (child.id === item1.id) {
            node.expanded = true;
            if (child.IsRoR === true) {
              child.checked = true;
              child.className = `done-icon nodeselected`;
            } else {
              child.checked = true;
              child.className = `empty-icon nodeselected`;
            }
          } else {
            if (child.IsRoR === true) {
              child.checked = false;
              child.className = `done-icon`;
            } else {
              child.checked = false;
              child.className = `empty-icon`;
            }
          }
          return child;
        });
      }
      return node;
    });
  }
};
export const DropDownTreeload = (Products, id, rev) => {
  return Products.forEach((node) => {
    node.expanded = false;

    if (node.productid === id && node.revsion == rev) {
      node.checked = true;
      node.className = `empty-icon nodeselected`;
    } else {
      node.checked = false;
      node.className = `empty-icon`;
    }

    if (node.children) {
      node.children.forEach((child) => {
        if (child.productid === id && child.revsion == rev) {
          node.expanded = true;
          if (child.IsRoR === true) {
            child.checked = true;
            child.className = `done-icon nodeselected`;
          } else {
            child.checked = true;
            child.className = `empty-icon nodeselected`;
          }
        } else {
          if (child.IsRoR === true) {
            child.checked = false;
            child.className = `done-icon`;
          } else {
            child.checked = false;
            child.className = `empty-icon`;
          }
        }
        return child;
      });
    }
    return node;
  });
};
export const Clearall = (localNodes) => {
  return localNodes.map((node) => {
    node.expanded = false;
    node.checked = false;
    node.className = `empty-icon`;

    if (node.children) {
      node.children = node.children.map((child) => {
        if (child.IsRoR === true) {
          child.checked = false;
          child.className = `done-icon`;
        } else {
          child.checked = false;
          child.className = `empty-icon`;
        }
        return child;
      });
    }
    return node;
  });
};
export const DropDownSampleload = (Products, id) => {
  return Products.forEach((node) => {
    node.expanded = false;

    if (node.productid === id) {
      node.checked = true;
      node.className = `empty-icon nodeselected`;
    } else {
      node.checked = false;
      node.className = `empty-icon`;
    }

    if (node.children) {
      node.children.forEach((child) => {
        if (child.productid === id) {
          node.expanded = true;
          if (child.IsRoR === true) {
            child.checked = true;
            child.className = `done-icon nodeselected`;
          } else {
            child.checked = true;
            child.className = `empty-icon nodeselected`;
          }
        } else {
          if (child.IsRoR === true) {
            child.checked = false;
            child.className = `done-icon`;
          } else {
            child.checked = false;
            child.className = `empty-icon`;
          }
        }
        return child;
      });
    }
    return node;
  });
};
