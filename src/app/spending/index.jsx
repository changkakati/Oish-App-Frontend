import { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "../../auth/auth-context";
import {
    getSpendings,
    deleteSpending,
} from "../../api/spending";

export default function Spending() {
    const { token } = useAuth();
    const router = useRouter();

    const [spendings, setSpendings] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadSpendings();
        }, [])
    );

    async function loadSpendings() {
        try {
            setLoading(true);

            const data = await getSpendings(token);

            setSpendings(data.spendings);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    function confirmDelete(id) {
        Alert.alert(
            "Delete spending?",
            "This transaction will be permanently deleted.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDelete(id),
                },
            ]
        );
    }

    async function handleDelete(id) {
        try {
            await deleteSpending(token, id);

            setSpendings((current) =>
                current.filter((item) => item.id !== id)
            );
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    }

    function renderSpending({ item }) {
        return (
            <View style={styles.item}>
                <View style={styles.itemInfo}>
                    <Text style={styles.amount}>₹{item.amount}</Text>

                    <Text style={styles.method}>
                        {item.payment_method}
                    </Text>

                    {item.note && (
                        <Text style={styles.note}>{item.note}</Text>
                    )}

                    <Text style={styles.date}>{item.date}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(`/spending/form?id=${item.id}`)
                        }
                    >
                        <Text>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => confirmDelete(item.id)}
                    >
                        <Text>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Spending</Text>

                <TouchableOpacity
                    onPress={() => router.push("/spending/form")}
                >
                    <Text style={styles.add}>+ Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={spendings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSpending}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        No spending yet.
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
    },

    add: {
        fontSize: 16,
        fontWeight: "600",
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },

    itemInfo: {
        gap: 4,
    },

    amount: {
        fontSize: 20,
        fontWeight: "bold",
    },

    method: {
        fontSize: 14,
    },

    note: {
        fontSize: 14,
    },

    date: {
        fontSize: 13,
    },

    actions: {
        justifyContent: "space-around",
    },

    empty: {
        textAlign: "center",
        marginTop: 50,
    },
});