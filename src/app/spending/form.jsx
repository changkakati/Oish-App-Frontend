import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "../../auth/auth-context";
import {
  getSpendings,
  createSpending,
  updateSpending,
} from "../../api/spending";

export default function SpendingForm() {
  const { token } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const editing = !!id;

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      loadSpending();
    }
  }, [id]);

  async function loadSpending() {
    try {
      setLoading(true);

      const data = await getSpendings(token);

      const spending = data.spendings.find(
        (item) => item.id.toString() === id.toString()
      );

      if (!spending) {
        Alert.alert("Error", "Spending not found");
        router.back();
        return;
      }

      setAmount(String(spending.amount));
      setPaymentMethod(spending.payment_method);
      setNote(spending.note || "");
      setDate(spending.date);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!amount || !date) {
      Alert.alert("Error", "Amount and date are required");
      return;
    }

    try {
      setLoading(true);

      const spending = {
        amount: Number(amount),
        payment_method: paymentMethod,
        note,
        date,
      };

      if (editing) {
        await updateSpending(token, id, spending);
      } else {
        await createSpending(token, spending);
      }

      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && editing && !amount) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editing ? "Edit Spending" : "Add Spending"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Payment method</Text>

      <View style={styles.methods}>
        {["UPI", "Cash", "Lend money"].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.method,
              paymentMethod === method && styles.selectedMethod,
            ]}
            onPress={() => setPaymentMethod(method)}
          >
            <Text>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading
            ? "Saving..."
            : editing
              ? "Update Spending"
              : "Add Spending"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text>Cancel</Text>
      </TouchableOpacity>
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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },

  label: {
    marginBottom: 10,
    fontWeight: "600",
  },

  methods: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  method: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },

  selectedMethod: {
    //   backgroundColor: "#f6f6f6",
      borderColor: "#0f0f0f"
  },

  saveButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    fontWeight: "bold",
  },

  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
});