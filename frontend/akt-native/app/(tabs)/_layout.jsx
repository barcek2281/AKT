import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../index";
import Details from "../details";
import ScanPage from '../scanpage';
import AccountPage from '../account';
import DashboardPage from '../dashboard';

const Stack = createStackNavigator();

export default function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} options={{ title: "Главная" }} />
        <Stack.Screen name="Details" component={Details} options={{ title: "Детали" }} />
        <Stack.Screen name="Scan" component={ScanPage} options={{ title: "Сканирование" }} />
        <Stack.Screen name='Account' component={AccountPage} options={{ title: "Аккаунт" }}/>
        <Stack.Screen name='Dashboard' component={DashboardPage} options={{ title: "Дэшборд" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
