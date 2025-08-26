import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { type MealPlanData, type Day, type Meal, type ShoppingCategory, type ShoppingItem } from "@/types/pdf";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#333" },
  header: { borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#059669" },
  section: { marginBottom: 20 },
  dayTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 10, color: "#111" },
  mealCard: { borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 5, padding: 10, marginBottom: 10 },
  mealTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  macroRow: { flexDirection: 'row', gap: 10, fontSize: 9, color: '#666', marginTop: 4 },
  shoppingCat: { fontSize: 14, marginTop: 12, marginBottom: 5, fontFamily: "Helvetica-Bold" },
  shoppingItem: { marginLeft: 10, marginBottom: 2 },
  footer: { position: 'absolute', bottom: 25, left: 40, right: 40, fontSize: 8, color: '#999', textAlign: 'center' },
});

// Компонент PDF стал типобезопасным
export function PlanPdfDocument({ plan }: { plan: MealPlanData }) {
  return (
    <Document>
      {/* --- Обложка --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{plan?.title ?? 'Personalized Meal Plan'}</Text>
          <Text style={{ fontSize: 10, color: '#555' }}>ShapeAI.co.uk</Text>
        </View>
        <View style={styles.section}>
          <Text>Prepared for: {plan?.user?.name ?? 'Valued User'}</Text>
          <Text>Daily Target: ~{plan?.targets?.daily_kcal ?? 0} kcal</Text>
          <Text style={{ fontSize: 10, color: '#555' }}>
            Macros: P {plan?.targets?.daily_macros?.protein_g ?? 0}g · F {plan?.targets?.daily_macros?.fat_g ?? 0}g · C {plan?.targets?.daily_macros?.carbs_g ?? 0}g
          </Text>
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: '#aaa' }}>(QR Code for {plan?.pdf?.qr_url ?? ''} will be here)</Text>
        </View>
        <Text style={styles.footer}>© {new Date().getFullYear()} ShapeAI. All rights reserved.</Text>
      </Page>

      {/* --- Дни Плана --- */}
      {plan?.days?.map((day: Day) => (
        <Page key={day.day} size="A4" style={styles.page}>
          <Text style={styles.dayTitle}>Day {day.day}</Text>
          <View style={styles.section}>
            {day.meals.map((meal: Meal) => {
              const recipe = plan.recipes?.[meal.recipe_id];
              if (!recipe) return null;

              return (
                <View key={meal.type + meal.recipe_id} style={styles.mealCard}>
                  <Text style={styles.mealTitle}>
                    {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} — {recipe.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#555' }}>
                    {recipe.portion} · {meal.kcal} kcal
                  </Text>
                  <View style={styles.macroRow}>
                    <Text>Protein: {meal.protein_g}g</Text>
                    <Text>Fat: {meal.fat_g}g</Text>
                    <Text>Carbs: {meal.carbs_g}g</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <Text style={styles.footer}>ShapeAI · Day {day.day}</Text>
        </Page>
      ))}

      {/* --- Список Покупок --- */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Shopping List</Text>
        {plan?.shopping_list?.by_category?.map((category: ShoppingCategory) => (
          <View key={category.category}>
            <Text style={styles.shoppingCat}>{category.category}</Text>
            {category.items.map((item: ShoppingItem) => (
              <Text key={item.name} style={styles.shoppingItem}>• {item.name} — {item.qty}{item.unit}</Text>
            ))}
          </View>
        ))}
        <Text style={styles.footer}>{plan?.legal?.medical_disclaimer ?? ''}</Text>
      </Page>
    </Document>
  );
}