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
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { useAuth } from "../../auth/auth-context";
import {
  getIncomes,
  createIncome,
  updateIncome,
} from "../../api/income";

export default function IncomeForm() {
  const { token } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const editing = !!id;

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      loadIncome();
    }
  }, [id]);

  async function loadIncome() {
    try {
      setLoading(true);

      const data = await getIncomes(token);

      const income = data.incomes.find(
        (item) =>
          item.id.toString() === id.toString()
      );

      if (!income) {
        Alert.alert("Error", "Income not found");
        router.back();
        return;
      }

      setAmount(String(income.amount));
      setNote(income.note || "");
      setDate(income.date);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!amount || !date) {
      Alert.alert(
        "Error",
        "Amount and date are required"
      );
      return;
    }

    try {
      setLoading(true);

      const income = {
        amount: Number(amount),
        note,
        date,
      };

      if (editing) {
        await updateIncome(token, id, income);
      } else {
        await createIncome(token, income);
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
        {editing ? "Edit Income" : "Add Income"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

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
              ? "Update Income"
              : "Add Income"}
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