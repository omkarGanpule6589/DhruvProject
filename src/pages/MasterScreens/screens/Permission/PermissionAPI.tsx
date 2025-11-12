import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getPermissionList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Permission?$select=PermissionId,PermissionName,Description,PermissionName,LastModifiedUserId,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getPermissionById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Permission?$filter=PermissionId eq ${id}&$select=PermissionId,PermissionName,LastModifiedUserId,Description,PermissionType,LastModifiedDateTime&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editPermission(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Permission?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createPermission(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Permission`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// export function Permissionlist(id, RoleName) {
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
export function Permissionlist(id, RoleName) {
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

