import { useCallback, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
    RefreshControl,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "../../auth/auth-context";
import { getDashboard } from "../../api/dashboard";

export default function Dashboard() {
    const { user, token, logout } = useAuth();
    const router = useRouter();

    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function handleRefresh() {
        try {
            setRefreshing(true);
            const data = await getDashboard(token, month);
            setDashboard(data);
        } catch (error) {
            Alert.alert("Error", "Could not refresh dashboard");
        } finally {
            setRefreshing(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (token) {
                loadDashboard();
            }
        }, [token, month])
    );

    async function loadDashboard() {
        try {
            setLoading(true);
            const data = await getDashboard(token, month);
            setDashboard(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not load dashboard");
        } finally {
            setLoading(false);
        }
    }

    function changeMonth(amount) {
        const [year, currentMonth] = month.split("-").map(Number);

        const date = new Date(year, currentMonth - 1 + amount, 1);

        const newMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

        setMonth(newMonth);
    }

    async function handleLogout() {
        await logout();
        router.replace("/auth/login");
    }

    function getTransactions() {
        const incomes = (dashboard?.incomes || []).map((item) => ({
            ...item,
            type: "income",
        }));

        const spendings = (dashboard?.spendings || []).map((item) => ({
            ...item,
            type: "spending",
        }));

        return [...incomes, ...spendings]
            .sort((a, b) => {
                if (a.date !== b.date) {
                    return b.date.localeCompare(a.date);
                }
                if (a.created_at !== b.created_at) {
                    return b.created_at.localeCompare(a.created_at);
                }
                return b.id - a.id;
            })
            .slice(0, 4);
    }

    const monthName = new Date(`${month}-01`).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });

    if (loading && !dashboard) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const income = Number(dashboard?.income ?? 0);
    const spending = Number(dashboard?.spending ?? 0);
    const balance = Number(dashboard?.balance ?? 0);

    const transactions = getTransactions();

    return (
        <View className="flex-1 bg-neutral-100 my-4">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* HEADER */}
                <View className="mb-4 py-2 rounded-2xl px-3 bg-white">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-neutral-500">
                            Hello,{" "}
                            <Text className="text-neutral-900">
                                {user?.username
                                    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                                    : ""}
                            </Text>
                        </Text>

                        <TouchableOpacity
                            className="rounded-2xl bg-neutral-900 px-3.5 py-2"
                            onPress={handleLogout}
                        >
                            <Text className="text-[13px] font-semibold text-white">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {/* <Text className="mb-7 text-[20px] text-center font-bold">Your Finances</Text> */}

                {/* MONTH */}
                <View className="mb-[18px] flex-row items-center justify-between">
                    <TouchableOpacity
                        className="h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
                        onPress={() => changeMonth(-1)}
                    >
                        <Text className="text-[28px] leading-[28px] text-center align-middle">
                            ‹
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-lg font-semibold">{monthName}</Text>

                    <TouchableOpacity
                        className="h-[42px] w-[42px] items-center justify-center rounded-full bg-white"
                        onPress={() => changeMonth(1)}
                    >
                        <Text className="text-[28px] leading-[28px] text-center align-middle">
                            ›
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* BALANCE */}
                <View className="mb-3 rounded-[18px] bg-neutral-900 p-6">
                    <Text className="mb-2 text-sm text-neutral-400">Balance</Text>

                    <Text className="text-[34px] font-bold text-white">
                        ₹{balance.toFixed(2)}
                    </Text>

                    <Text className="mt-2 text-xs text-neutral-500">{monthName}</Text>
                </View>

                {/* INCOME + SPENDING */}
                <View className="mb-7 flex-row gap-3">
                    <View className="flex-1 rounded-2xl bg-white p-[18px]">
                        <Text className="mb-2 text-[13px] text-neutral-500">Income</Text>
                        <Text className="text-xl font-bold">₹{income.toFixed(2)}</Text>
                    </View>

                    <View className="flex-1 rounded-2xl bg-white p-[18px]">
                        <Text className="mb-2 text-[13px] text-neutral-500">Spending</Text>
                        <Text className="text-xl font-bold">₹{spending.toFixed(2)}</Text>
                    </View>
                </View>

                {/* QUICK ACTIONS */}
                <Text className="mb-3 text-lg font-bold">Quick Actions</Text>

                <View className="mb-7 gap-2.5">
                    <TouchableOpacity
                        className="flex-row items-center rounded-2xl bg-white p-4"
                        onPress={() => router.push("/income/form")}
                    >
                        <View className="mr-3.5 h-[42px] w-[42px] items-center justify-center rounded-full bg-neutral-100">
                            <Text className="text-2xl leading-6 text-center align-middle">
                                +
                            </Text>
                        </View>

                        <View>
                            <Text className="text-base font-semibold">Add Income</Text>
                            <Text className="mt-[3px] text-xs text-neutral-500">
                                Record money received
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center rounded-2xl bg-white p-4"
                        onPress={() => router.push("/spending/form")}
                    >
                        <View className="mr-3.5 h-[42px] w-[42px] items-center justify-center rounded-full bg-neutral-100">
                            <Text className="text-2xl leading-6 text-center align-middle">
                                −
                            </Text>
                        </View>

                        <View>
                            <Text className="text-base font-semibold">Add Spending</Text>
                            <Text className="mt-[3px] text-xs text-neutral-500">
                                Record money spent
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* RECENT TRANSACTIONS */}
                <View className="flex-row items-center justify-between">
                    <Text className="mb-3 text-lg font-bold">Recent Transactions</Text>
                </View>

                <View className="mb-3 rounded-2xl bg-white px-4">
                    {transactions.length === 0 ? (
                        <Text className="py-6 text-center text-neutral-500">
                            No transactions this month.
                        </Text>
                    ) : (
                        transactions.map((item, index) => (
                            <View
                                key={`${item.type}-${item.id}`}
                                className={`flex-row items-center py-[15px] ${index === transactions.length - 1
                                    ? ""
                                    : "border-b border-neutral-200"
                                    }`}
                            >
                                <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                                    <Text className="text-[15px] leading-[15px] text-center align-middle">
                                        {item.type === "income" ? "+" : "−"}
                                    </Text>
                                </View>

                                <View className="flex-1">
                                    <Text
                                        className="text-[15px] font-semibold"
                                        numberOfLines={1}
                                    >
                                        {item.note ||
                                            (item.type === "income"
                                                ? "Income"
                                                : item.payment_method)}
                                    </Text>

                                    <Text className="mt-1 text-xs text-neutral-500">
                                        {item.date}
                                    </Text>
                                </View>

                                <Text className="text-sm font-bold">
                                    {item.type === "income" ? "+" : "−"}₹
                                    {Number(item.amount).toFixed(2)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* VIEW SPENDING */}
                <TouchableOpacity
                    className="mb-2.5 flex-row items-center justify-between rounded-2xl bg-white p-[17px]"
                    onPress={() => router.push("/spending")}
                >
                    <Text className="text-[15px] font-semibold">View Spending</Text>
                    <Text className="text-2xl">›</Text>
                </TouchableOpacity>

                {/* VIEW INCOME */}
                <TouchableOpacity
                    className="mb-2.5 flex-row items-center justify-between rounded-2xl bg-white p-[17px]"
                    onPress={() => router.push("/income")}
                >
                    <Text className="text-[15px] font-semibold">View Income</Text>
                    <Text className="text-2xl">›</Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator className="mt-2.5" />}
            </ScrollView>
        </View>
    );
}