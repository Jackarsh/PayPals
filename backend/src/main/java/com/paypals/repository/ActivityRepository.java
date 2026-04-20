package com.paypals.repository;

import com.paypals.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByGroupIdOrderByCreatedAtDesc(Long groupId);

}
