import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: resolve => require(['copt/home/home.vue'], resolve),
      children: [
        {
          path: '/index',
          component: resolve => require(['copt/index/index.vue'], resolve)
        },
        {
          path: '/applyTask',
          component: resolve => require(['copt/applyTask/applyTask.vue'], resolve)
        },
        {
          path: '/applyTask/:action',
          component: resolve => require(['copt/applyTask/checkApplyTask.vue'], resolve)
        },
        {
          path: '/applyPlan',
          component: resolve => require(['copt/applyPlan/applyPlan.vue'], resolve)
        },
        {
          path: '/applyPlan/:action',
          component: resolve => require(['copt/applyPlan/checkApplyPlan.vue'], resolve)
        },
        {
          path: '/aircraftManage',
          component: resolve => require(['copt/aircraftManage/aircraftManage.vue'], resolve),
        },
        {
          path: '/aircraftModelManage',
          component: resolve => require(['copt/aircraftManage/aircraftModelManage.vue'], resolve),
        },
        {
          path: '/aircraftManufacturer',
          component: resolve => require(['copt/aircraftManage/aircraftManufacturer.vue'], resolve),
        },
        {
          path: '/addAircraftModelManage/:action',
          component: resolve => require(['copt/aircraftManage/addAircraftModelManage.vue'], resolve)
        },
        {
          path: '/aircraftManage/:action',
          component: resolve => require(['copt/aircraftManage/checkAircraft.vue'], resolve),
        },
        {
          path: '/checkaircraftModelManage/:action',
          component: resolve => require(['copt/aircraftManage/checkaircraftModelManage.vue'], resolve),
        },
        {
          path: '/pilotManage',
          component: resolve => require(['copt/pilotManage/pilotManage.vue'], resolve)
        },
        {
          path: '/pilotManage/:action',
          component: resolve => require(['copt/pilotManage/checkPilot.vue'], resolve)
        },
        {
          path: '/accountManage',
          component: resolve => require(['copt/accountManage/accountManage.vue'], resolve)
        },
        {
          path: '/accountManage/:action',
          component: resolve => require(['copt/accountManage/checkAccount.vue'], resolve)
        },
        {
          path: '/airLineManage',
          component: resolve => require(['copt/airLineManage/airLineManage.vue'], resolve)
        },
        {
          path: '/airLineManage/:action/:check',
          component: resolve => require(['copt/airLineManage/checkAirLine.vue'], resolve)
        },
        {
          path: '/airLineManage/:action',
          component: resolve => require(['copt/airLineManage/addAirLine.vue'], resolve)
        },
        {
          path: '/airportManage/airportBasicDataClean',
          component: resolve => require(['copt/airportInfoManage/airportBasicDataClean.vue'], resolve)
        },
        {
          path: '/airportManage/airportBasicEditInfo',
          component: resolve => require(['copt/airportInfoManage/airportBasicEditInfo.vue'], resolve)
        },
        {
          path: '/airportManage',
          component: resolve => require(['copt/airportInfoManage/airportInfoManage.vue'], resolve)
        },
        {
          path: '/airportManage/:action',
          component: resolve => require(['copt/airportInfoManage/addAirportInfo.vue'], resolve)
        },
        {
          path: '/airspaceManage',
          component: resolve => require(['copt/airspaceManage/airspaceManage.vue'], resolve)
        },
        {
          path: '/airspaceManage/:action',
          component: resolve => require(['copt/airspaceManage/addAirSpace.vue'], resolve)
        },
        {
          path: '/airspaceManage/:action/:check',
          component: resolve => require(['copt/airspaceManage/checkAirspace.vue'], resolve)
        },
        {
          path: '/airportManage',
          component: resolve => require(['copt/airportManage/airportManage.vue'], resolve)
        },
        {
          path: '/ukeySetting',
          component: resolve => require(['copt/settingManage/ukeySetting.vue'], resolve)
        },
        {
          path: '/privateLetterManage',
          component: resolve => require(['copt/privateLetterManage/privateLetterManage.vue'], resolve)
        },
        {
          path: '/noticeManage',
          component: resolve => require(['copt/noticeManage/noticeManage.vue'], resolve)
        },
        {
          path: '/noticeManage/:action',
          component: resolve => require(['copt/noticeManage/checkNotice.vue'], resolve)
        },
        {
          path: '/dataPermissionsManage',
          component: resolve => require(['copt/dataPermissionsManage/dataPermissionsManage.vue'], resolve)
        },
        {
          path: '/flightSchedule',
          component: resolve => require(['copt/flightSchedule/flightSchedule.vue'], resolve)
        },
        {
          path: '/flightSchedule/:action',
          component: resolve => require(['copt/flightSchedule/checkFlightSchedule.vue'], resolve)
        },
        {
          path: '/authorityMemberManage',
          component: resolve => require(['copt/authorityMemberManage/authorityMemberManage.vue'], resolve)
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['copt/login/login.vue'], resolve),
    }
  ],
  mode: 'hash',
  base: '/declaring/'
});
router.afterEach((to, from) => {
  if(to.path.length > 1 && from.path.length > 1 && to.path !== '/index') {
    document.querySelector(".M_content").scrollTop = 0;
  }
});

export default router;
