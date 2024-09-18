package org.example


import org.jetbrains.exposed.sql.Table
data class Product(
    val id: Int,
    val name: String,
    val description: String,
    val price: Double,
    val imageUrl: String,
    val category: String
)