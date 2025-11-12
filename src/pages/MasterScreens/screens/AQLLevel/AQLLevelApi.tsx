import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

// export function Permission(id, RoleName) {
//   const accessToken = getSessionToken();
//   return api.get(
//     `/odata/Role?$filter=RoleId eq ${id}&$expand=RolePermissions($filter=Permission/PermissionName eq '${RoleName}' and IsDeleted ne true)`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );
// }

// export function Permission1(id, RoleName) {
//   const accessToken = getSessionToken();
// return api.get(
//   `/odata/RolePermisiionFetch?id=${id}&permissionValue=${RoleName}`,
//   {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   }
// );
// }
export function Permission(id, RoleName) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/RolePermisiionFetch?id=${id}&permissionValue=${RoleName}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(response => {
    // Optimize key transformation for rolePermissions and map over them more efficiently
    const transformedData = response.data.value.map(role => {
      // Transform the 'RolePermissions' directly within the same mapping
      const transformedRolePermissions = role.rolePermissions.map(permission => {
        // Efficient way to capitalize keys using Object.fromEntries
        return Object.fromEntries(
          Object.entries(permission).map(([key, value]) => [
            key.charAt(0).toUpperCase() + key.slice(1), value
          ])
        );
      });

      return {
        ...role,
        RolePermissions: transformedRolePermissions
      };
    });

    // Return the transformed data with 'RolePermissions' properly capitalized
    return {
      ...response,
      data: {
        ...response.data,
        value: transformedData
      }
    };
  });
}

// export function Permission(id, RoleName) {
//   const accessToken = getSessionToken();
//   return api.get(
//     `/odata/RolePermisiionFetch?id=${id}&permissionValue=${RoleName}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   ).then(response => {
//     // Transform the response to capitalize the first letter of each key, including 'RolePermissions'
//     const transformedData = response.data.value.map(role => {
//       return {
//         ...role,
//         RolePermissions: role.rolePermissions.map(permission => {
//           // Capitalize the first letter of each key in the permission object
//           const capitalizedPermission = {};
//           Object.keys(permission).forEach(key => {
//             const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
//             capitalizedPermission[capitalizedKey] = permission[key];
//           });
//           return capitalizedPermission;
//         })
//       };
//     });

//     // Return the transformed data with 'RolePermissions' properly capitalized
//     return {
//       ...response,
//       data: {
//         ...response.data,
//         value: transformedData
//       }
//     };
//   });
// }




export function getAqlLevelList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Aqllevel?$expand=CreatedUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getAqlLevelListById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Aqllevel?$filter=AqllevelId eq ${id}&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editAqlLevel(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Aqllevel?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createAqlLevel(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Aqllevel`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
