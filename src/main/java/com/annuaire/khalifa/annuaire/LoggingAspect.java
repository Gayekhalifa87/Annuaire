package com.annuaire.khalifa.annuaire;

import com.annuaire.khalifa.annuaire.services.EmployeService;
import com.annuaire.khalifa.annuaire.services.HistoriqueService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Aspect
@Component
public class LoggingAspect {

    @Autowired
    private HistoriqueService historiqueService;

    @Autowired
    private EmployeService employeService; // injecter le service employé

    // Logger console avant l’exécution
    @Before("execution(* com.annuaire.khalifa.annuaire.services.EmployeService.*(..)) || " +
            "execution(* com.annuaire.khalifa.annuaire.services.HistoriqueService.*(..))")
    public void logBeforeMethod(JoinPoint joinPoint) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        logger.info("Entering method: " + joinPoint.getSignature().getName());
    }

    // Logger console après exécution
    @AfterReturning(pointcut = "execution(* com.annuaire.khalifa.annuaire.services.EmployeService.*(..)) || " +
            "execution(* com.annuaire.khalifa.annuaire.services.HistoriqueService.*(..))",
            returning = "result")
    public void logAfterMethod(JoinPoint joinPoint, Object result) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        logger.info("Method " + joinPoint.getSignature().getName() + " executed with result: " + result);
    }

    // Logger console en cas d’exception
    @AfterThrowing(pointcut = "execution(* com.annuaire.khalifa.annuaire.services.EmployeService.*(..)) || " +
            "execution(* com.annuaire.khalifa.annuaire.services.HistoriqueService.*(..))",
            throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        logger.error("Exception in method: " + joinPoint.getSignature().getName(), ex);
    }

    // Logger automatique dans la table historique pour les méthodes sensibles d’EmployeService
    @AfterReturning("execution(* com.annuaire.khalifa.annuaire.services.EmployeService.createEmploye(..)) || " +
            "execution(* com.annuaire.khalifa.annuaire.services.EmployeService.deleteEmploye(..)) || " +
            "execution(* com.annuaire.khalifa.annuaire.services.EmployeService.switchRole(..)) || " +
            "execution(* com.annuaire.khalifa.annuaire.services.EmployeService.updateEmploye(..))")
    public void logActionToDatabase(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        int employeId = -1;

        // Récupérer idEmploye depuis les arguments (adaptable selon la méthode)
        if(args != null && args.length > 0) {
            if(args[0] instanceof Integer) {
                employeId = (Integer) args[0];
            } else if(args[0] instanceof com.annuaire.khalifa.annuaire.models.Employe) {
                employeId = ((com.annuaire.khalifa.annuaire.models.Employe) args[0]).getId();
            }
        }

        if (employeId != -1) {
            final int finalEmployeId = employeId; // rendre l'ID final pour le lambda
            employeService.findById(finalEmployeId).ifPresent(employe -> {
                // Construire une description claire incluant l'action et l'ID de l'employé
                String actionDescription = switch (joinPoint.getSignature().getName()) {
                    case "createEmploye" -> "Ajout de l'employé avec ID " + finalEmployeId;
                    case "deleteEmploye" -> "Suppression de l'employé avec ID " + finalEmployeId;
                    case "switchRole" -> "Changement de rôle de l'employé avec ID " + finalEmployeId;
                    case "updateEmploye" -> "Mise à jour de l'employé avec ID " + finalEmployeId;
                    default -> "Action inconnue sur l'employé avec ID " + finalEmployeId;
                };

                historiqueService.logAction(actionDescription, employe);
            });
        }

    }
}
