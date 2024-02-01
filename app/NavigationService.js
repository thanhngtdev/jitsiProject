import {
  CommonActions,
  NavigationContainerRef,
  NavigationState,
  PartialState,
  Route,
  StackActions,
} from '@react-navigation/native';
import {
  AppStackParamList,
  AuthStackParamList,
} from 'app/modules/navigation/AppParamsList';

export default class NavigationService {
  static topLevelNavigator;

  static setTopLevelNavigator = ref =>
    (NavigationService.topLevelNavigator = ref);

  static reset = resetState => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(
        CommonActions.reset(resetState),
      );
    }
  };

  static navigate = (routeName, params) => {
    if (NavigationService.topLevelNavigator != null && routeName) {
      NavigationService.topLevelNavigator.dispatch(
        CommonActions.navigate({
          name: routeName.toString(),
          params,
        }),
      );
    }
  };

  static push = (routeName, params) => {
    if (NavigationService.topLevelNavigator != null && routeName) {
      NavigationService.topLevelNavigator.dispatch(
        StackActions.push(routeName.toString(), params),
      );
    }
  };

  static pop = () => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(CommonActions.goBack());
    }
  };

  static popToTop = () => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(StackActions.popToTop());
    }
  };

  static replace = (routeName, params) => {
    if (NavigationService.topLevelNavigator != null) {
      NavigationService.topLevelNavigator.dispatch(
        StackActions.replace(routeName.toString(), params),
      );
    }
  };
}
