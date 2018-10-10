import fetch from './../fetch.js'

// 用户管理--查询支付订单列表
const getManageUserList = params => {
  return fetch({
    url: '/pas/user/selectList',
    params: params,
    method: 'get'
  })
}
// 用户管理--删除用户
const deleteManageUserById = params => {
  return fetch({
    url: '/pas/user/deleteUser',
    params: params,
    method: 'get',
    responseType: 'text'
  })
}
// 用户管理--新增用户
const saveManageUse = params => {
  return fetch({
    url: '/pas/user/createUser',
    data: params,
    method: 'post'
  })
}
// 用户管理--获取用户角色
const getRoleList = params => {
  return fetch({
    url: '/pas/role/selectAllRoles',
    method: 'get'
  })
}
// 用户管理--获取部门
// const getDeptList = params => {
//   return fetch({
//     url: '/pas/Department/all',
//     method: 'get'
//   })
// }

// 用户管理--查看用户
const getUserById = params => {
  return fetch({
    url: '/pas/user/selectUserById',
    params: params,
    method: 'get'
  })
}
// 用户管理--编辑用户
const editUser = params => {
  return fetch({
    url: '/pas/user/updateUser',
    data: params,
    method: 'post'
  })
}

// 用户管理 --禁用/启用
const useableUser = params => {
  return fetch({
    url: '/pas/user/modifyUser',
    data: params,
    method: 'post'
  })
}
// 角色管理
const roleManage = {
  // 获取角色列表
  getRoleList: params => {
    return fetch({
      url: '/pas/role/selectList',
      params: params,
      method: 'get'
    })
  },
  // 删除角色
  deleteRoleById: params => {
    return fetch({
      url: '/pas/role/deleteRole',
      params: params,
      method: 'get'
    })
  },
  // 获取全部角色 /role/getAllRoleTree
  getAllRoleTree: () => {
    return fetch({
      url: '/pas/Perm/basicTree',
      method: 'get'
    })
  },
  selectAllRoles: () => {
    return fetch({
      url: '/pas/role/selectAllRoles',
      method: 'get'
    })
  },
  getAllRoleTreeById: (params) => {
    return fetch({
      url: '/pas/role/selectById?uid=' + params,
      method: 'get'
    })
  },
  // 新增角色
  createRole: params => {
    return fetch({
      url: '/pas/role/createRole',
      method: 'post',
      data: params
    })
  },
  // 查询角色信息
  getRoleById: params => {
    return fetch({
      url: '/pas/role/selectById',
      method: 'get',
      params: params
    })
  },
  // 编辑角色
  updateRole: params => {
    return fetch({
      url: '/pas/role/updateRole',
      method: 'post',
      data: params
    })
  }
}

// 权限管理
const authManage = {
  // 新增
  createAuth: params => {
    return fetch({
      url: '/pas/perm/createPerm',
      method: 'post',
      data: params
    })
  },
  // 编辑
  updateAuth: params => {
    return fetch({
      url: '/pas/perm/updatePerm',
      method: 'post',
      data: params
    })
  },
  // 删除
  deleteAuth: params => {
    return fetch({
      url: '/pas/perm/deletePerm?uid=' + params.uid,
      method: 'get',
      responseType: 'text'
    })
  },
  // 获取所有的权限
  getAllAuthTree: () => {
    return fetch({
      url: '/pas/role/getAllRoleTree',
      method: 'get'
    })
  },
  // 查询权限信息
  getAuthById: params => {
    return fetch({
      url: '/pas/perm/selectById',
      method: 'get',
      params: params
    })
  }
}

// 部门管理
const departManage = {
  // 获取所有部门
  getDepartList: () => {
    return fetch({
      url: '/pas/Department/all',
      method: 'get'
      // params: params
    })
  },
  // 新增部门
  addDepart: (params) => {
    return fetch({
      url: '/pas/Department/add',
      method: 'post',
      data: params
      // headers: {'Content-Type': 'application/json'}
    })
  },
  // 获取部门详情
  getDepartDetail: (params) => {
    return fetch({
      url: '/pas/Department/detail?id=' + params,
      method: 'get'
    })
  },
  // 修改部门
  modifyDepart: (params) => {
    return fetch({
      url: '/pas/Department/modify',
      method: 'PUT',
      params: params
    })
  },
  // 删除部门
  deleteDepart: (params) => {
    return fetch({
      url: '/pas/Department/delete?id=' + params,
      method: 'DELETE'
    })
  }

}

// 用户管理新增
const userManage = {
  // 重置密码
  restUserPwd: (params) => {
    return fetch({
      url: '/pas/user/restUserPwd',
      method: 'post',
      data: params
    })
  }
}

export default {
  getManageUserList,
  deleteManageUserById,
  saveManageUse,
  getRoleList,
  getUserById,
  editUser,
  roleManage,
  authManage,
  useableUser,
  departManage,
  userManage
}
