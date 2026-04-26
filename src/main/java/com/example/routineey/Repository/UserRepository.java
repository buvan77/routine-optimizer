package com.example.routineey.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.routineey.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
}
