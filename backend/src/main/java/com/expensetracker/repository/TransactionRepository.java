package com.expensetracker.repository;

import com.expensetracker.model.Transaction;
import com.expensetracker.model.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByTxnDateDesc(Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :uid " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:month IS NULL OR MONTH(t.txnDate) = :month) " +
           "AND (:year  IS NULL OR YEAR(t.txnDate)  = :year) " +
           "ORDER BY t.txnDate DESC")
    List<Transaction> findFiltered(@Param("uid")   Long uid,
                                   @Param("type")  TransactionType type,
                                   @Param("month") Integer month,
                                   @Param("year")  Integer year);

    @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t WHERE t.user.id = :uid AND t.type = :type AND MONTH(t.txnDate) = :month AND YEAR(t.txnDate) = :year")
    BigDecimal sumByTypeAndMonth(@Param("uid") Long uid, @Param("type") TransactionType type,
                                 @Param("month") int month, @Param("year") int year);

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.user.id = :uid AND t.type = 'EXPENSE' AND MONTH(t.txnDate) = :month AND YEAR(t.txnDate) = :year GROUP BY t.category")
    List<Object[]> sumByCategory(@Param("uid") Long uid, @Param("month") int month, @Param("year") int year);

    @Query("SELECT MONTH(t.txnDate), SUM(t.amount) FROM Transaction t WHERE t.user.id = :uid AND t.type = :type AND YEAR(t.txnDate) = :year GROUP BY MONTH(t.txnDate)")
    List<Object[]> monthlyTotals(@Param("uid") Long uid, @Param("type") TransactionType type, @Param("year") int year);

    List<Transaction> findTop5ByUserIdOrderByTxnDateDesc(Long userId);
}
