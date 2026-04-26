package com.example.routineey.Repository;

import com.example.routineey.Model.RoutineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoutineLogRepository extends JpaRepository<RoutineLog, Long> {
    List<RoutineLog> findByUsername(String username);
}